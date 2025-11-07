<#
.SYNOPSIS
    Automates syncing the local frontend and backend repositories with GitHub and an EC2 server.

.DESCRIPTION
    1. Optionally stages, commits, and pushes changes from the local frontend (C:\Server) and backend (C:\artistkatta-server) repos.
    2. Optionally connects to the EC2 host and pulls the latest changes for each repo.
    3. Supports dry-run mode to preview actions without executing them.

.PARAMETER RemoteHost
    The hostname or IP of the EC2 instance (e.g. ec2-xx-xx-xx-xx.compute-1.amazonaws.com).

.PARAMETER RemoteUser
    The SSH username for the EC2 instance (default: ec2-user).

.PARAMETER SSHKeyPath
    Path to the SSH private key for connecting to EC2. If omitted, the default SSH config is used.

.PARAMETER CommitMessage
    Commit message used when committing local changes. Defaults to "Sync <timestamp>".

.PARAMETER SkipFrontend
    Skips syncing the frontend repo located at FrontendPath.

.PARAMETER SkipBackend
    Skips syncing the backend repo located at BackendPath.

.PARAMETER DryRun
    Prints commands without executing them.

.PARAMETER FrontendPath
    Filesystem path to the local frontend repository (default: C:\Server).

.PARAMETER BackendPath
    Filesystem path to the local backend repository (default: C:\artistkatta-server).

.PARAMETER FrontendRemotePath
    Remote path on EC2 for the frontend repository (default: /var/www/Server).

.PARAMETER BackendRemotePath
    Remote path on EC2 for the backend repository (default: /var/www/artistkatta-server).

.PARAMETER Force
    Forces the script to continue even if there are pending Git operations (e.g. rebase, merge).

.EXAMPLE
    .\sync-to-ec2.ps1 -RemoteHost ec2-52-11-22-33.compute-1.amazonaws.com -SSHKeyPath "~/.ssh/ec2.pem"

    Syncs both repos, commits with the default message (if needed), pushes to GitHub, then pulls on the EC2 instance using the specified key.
#>

[CmdletBinding()]
param(
    [string]$RemoteHost,
    [string]$RemoteUser = "ec2-user",
    [string]$SSHKeyPath,
    [string]$CommitMessage = $(Get-Date -Format "\'Sync\' yyyy-MM-dd HH:mm"),
    [string]$FrontendPath = "C:\\Server",
    [string]$BackendPath = "C:\\artistkatta-server",
    [string]$FrontendRemotePath = "/var/www/Server",
    [string]$BackendRemotePath = "/var/www/artistkatta-server",
    [switch]$SkipFrontend,
    [switch]$SkipBackend,
    [switch]$DryRun,
    [switch]$Force
)

function Write-Step {
    param(
        [string]$Message
    )

    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Invoke-CommandSafe {
    param(
        [string]$Command,
        [string]$WorkingDirectory,
        [switch]$AllowFailure
    )

    if ($DryRun) {
        Write-Host "[DryRun] (cd $WorkingDirectory && $Command)" -ForegroundColor Yellow
        return
    }

    Push-Location $WorkingDirectory
    try {
        Write-Host "$WorkingDirectory> $Command" -ForegroundColor DarkGray
        $result = Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0 -and -not $AllowFailure) {
            throw "Command failed with exit code ${LASTEXITCODE}: $Command"
        }
        return $result
    }
    finally {
        Pop-Location
    }
}

function Test-GitReady {
    param(
        [string]$Path
    )

    $status = Invoke-CommandSafe -Command "git status" -WorkingDirectory $Path
    if ($DryRun) { return $true }

    if ($status -join "`n" -match "You are currently (rebasing|merging|bisecting)") {
        if (-not $Force) {
            throw "Repository at $Path is in the middle of another Git operation. Resolve it or rerun with -Force."
        }
    }

    return $true
}

function Invoke-GitSync {
    param(
        [string]$Path,
        [string]$Label
    )

    Write-Step "Checking $Label repository at $Path"
    Test-GitReady -Path $Path

    $statusPorcelain = Invoke-CommandSafe -Command "git status --porcelain" -WorkingDirectory $Path
    if (-not $DryRun -and [string]::IsNullOrWhiteSpace(($statusPorcelain -join ""))) {
        Write-Host "No local changes detected for $Label. Skipping commit." -ForegroundColor Green
    }
    elseif ($DryRun) {
        Write-Host "[DryRun] Would stage and commit changes for $Label." -ForegroundColor Yellow
    }
    else {
        Write-Step "Staging changes for $Label"
        Invoke-CommandSafe -Command "git add -A" -WorkingDirectory $Path

        Write-Step "Committing changes for $Label"
        Invoke-CommandSafe -Command "git commit -m \"$CommitMessage\"" -WorkingDirectory $Path
    }

    Write-Step "Pushing $Label to remote"
    Invoke-CommandSafe -Command "git push" -WorkingDirectory $Path
}

function Invoke-RemotePull {
    param(
        [string]$RemotePath,
        [string]$Label
    )

    if ([string]::IsNullOrWhiteSpace($RemoteHost)) {
        Write-Host "Remote host not provided. Skipping remote pull for $Label." -ForegroundColor Yellow
        return
    }

    $sshCommand = "cd $RemotePath && git pull"
    $sshArgs = @()
    if ($SSHKeyPath) {
        $sshArgs += "-i"
        $sshArgs += $SSHKeyPath
    }

    $sshArgs += "$RemoteUser@$RemoteHost"
    $sshArgs += $sshCommand

    if ($DryRun) {
        Write-Host "[DryRun] ssh $($sshArgs -join ' ')" -ForegroundColor Yellow
        return
    }

    Write-Step "Pulling latest code for $Label on $RemoteHost"
    Write-Host "ssh $($sshArgs -join ' ')" -ForegroundColor DarkGray
    & ssh @sshArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Remote pull failed for $Label (exit code ${LASTEXITCODE})."
    }
}

try {
    if (-not $SkipFrontend) {
        Invoke-GitSync -Path $FrontendPath -Label "frontend"
    }
    else {
        Write-Host "Skipping frontend sync." -ForegroundColor Yellow
    }

    if (-not $SkipBackend) {
        Invoke-GitSync -Path $BackendPath -Label "backend"
    }
    else {
        Write-Host "Skipping backend sync." -ForegroundColor Yellow
    }

    if (-not $SkipFrontend) {
        Invoke-RemotePull -RemotePath $FrontendRemotePath -Label "frontend"
    }

    if (-not $SkipBackend) {
        Invoke-RemotePull -RemotePath $BackendRemotePath -Label "backend"
    }

    Write-Step "Sync completed successfully."
}
catch {
    Write-Error $_
    exit 1
}

