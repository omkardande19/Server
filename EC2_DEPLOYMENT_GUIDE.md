# Complete EC2 Deployment Guide for ArtistKatta

## 📋 Prerequisites

1. **AWS Account** with EC2 access
2. **EC2 Instance** (Recommended: t2.medium or larger)
3. **Operating System**: Amazon Linux 2, Ubuntu 20.04+, or similar
4. **Domain name** (optional, but recommended for production)

## 🚀 Step-by-Step EC2 Deployment

### Step 1: Launch EC2 Instance

1. **Go to AWS Console** → EC2 Dashboard
2. **Launch Instance** with these settings:
   - **AMI**: Amazon Linux 2 or Ubuntu 22.04 LTS
   - **Instance Type**: t2.medium (minimum), t2.large (recommended)
   - **Storage**: 20-30 GB
   - **Key Pair**: Create or select an existing key pair (download .pem file)

3. **Configure Security Group** - Add these inbound rules:
   ```
   Type            Protocol    Port Range    Source
   SSH             TCP         22            Your IP (or 0.0.0.0/0)
   HTTP            TCP         80            0.0.0.0/0
   HTTPS           TCP         443           0.0.0.0/0
   Custom TCP      TCP         3000          0.0.0.0/0 (Next.js)
   Custom TCP      TCP         5000          0.0.0.0/0 (Backend API, if separate)
   ```

4. **Launch** the instance and note your **Public IP address**

### Step 2: Connect to EC2 Instance

```bash
# Change permissions on your key file (first time only)
chmod 400 your-key.pem

# Connect via SSH
# For Amazon Linux:
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP

# For Ubuntu:
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 3: Install Node.js and Dependencies

```bash
# Update system packages
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Node.js (using nvm - recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version

# Install Git
sudo yum install git -y  # For Amazon Linux
# OR
sudo apt install git -y  # For Ubuntu

# Install PM2 globally (process manager)
npm install -g pm2
```

### Step 4: Clone and Setup Application

```bash
# Clone your repository
git clone https://github.com/omkardande19/artistkatta.git
cd artistkatta

# Install dependencies
npm install

# Create environment file
cp env.example .env.local
nano .env.local
```

### Step 5: Configure Environment Variables

Edit `.env.local` with your actual values:

```bash
# Replace YOUR_EC2_PUBLIC_IP with your actual EC2 public IP
NEXT_PUBLIC_SITE_URL=http://YOUR_EC2_PUBLIC_IP:3000
NEXT_PUBLIC_API_URL=http://YOUR_EC2_PUBLIC_IP:5000

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Add AWS Amplify credentials (if using)
NEXT_PUBLIC_AMPLIFY_REGION=your-aws-region
NEXT_PUBLIC_AMPLIFY_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_AMPLIFY_USER_POOL_CLIENT_ID=your-client-id
```

Save the file: `Ctrl+X`, then `Y`, then `Enter`

### Step 6: Build the Application

```bash
# Build for production
npm run build

# Test the build locally
npm run start
# Press Ctrl+C to stop
```

### Step 7: Start Application with PM2

```bash
# For development mode (not recommended for production)
pm2 start npm --name "artistkatta-dev" -- run dev

# For production mode (recommended)
pm2 start npm --name "artistkatta" -- start

# View logs
pm2 logs artistkatta

# Check status
pm2 status

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command that PM2 outputs
```

### Step 8: Access Your Application

Open your browser and navigate to:
```
http://YOUR_EC2_PUBLIC_IP:3000
```

## 🔧 Optional: Setup Nginx Reverse Proxy

For production, use Nginx to:
- Serve on port 80/443 instead of 3000
- Handle SSL certificates
- Better performance

### Install Nginx

```bash
# Amazon Linux
sudo amazon-linux-extras install nginx1 -y

# Ubuntu
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Configure Nginx

```bash
sudo nano /etc/nginx/conf.d/artistkatta.conf
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;  # or your-domain.com

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

Now access your app at: `http://YOUR_EC2_PUBLIC_IP` (port 80)

## 🔒 Optional: Setup SSL with Let's Encrypt

**Note**: Requires a domain name

```bash
# Install Certbot
# Amazon Linux
sudo yum install certbot python3-certbot-nginx -y

# Ubuntu
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal test
sudo certbot renew --dry-run
```

Update your `.env.local`:
```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Restart your app:
```bash
pm2 restart artistkatta
```

## 📊 Useful PM2 Commands

```bash
# View all processes
pm2 list

# View logs
pm2 logs artistkatta

# Restart application
pm2 restart artistkatta

# Stop application
pm2 stop artistkatta

# Delete from PM2
pm2 delete artistkatta

# Monitor resources
pm2 monit

# Save current process list
pm2 save

# Clear logs
pm2 flush
```

## 🔄 Updating Your Application

When you push changes to GitHub:

```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP

# Navigate to project
cd artistkatta

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Rebuild
npm run build

# Restart with PM2
pm2 restart artistkatta
```

## 🛡️ Security Best Practices

1. **Restrict SSH Access**: Update security group to allow SSH only from your IP
2. **Use HTTPS**: Always use SSL certificates in production
3. **Keep Updated**: Regularly update packages
   ```bash
   npm audit fix
   sudo yum update -y  # or sudo apt update && sudo apt upgrade -y
   ```
4. **Firewall**: Consider using AWS WAF (Web Application Firewall)
5. **Backup**: Regular backups of your EC2 instance
6. **Monitoring**: Setup CloudWatch for monitoring and alerts

## 📈 Scaling Options

### Vertical Scaling
- Upgrade EC2 instance type (t2.medium → t2.large → t2.xlarge)

### Horizontal Scaling
- Use AWS Load Balancer
- Multiple EC2 instances
- Auto Scaling Groups

### Advanced Options
- **AWS Amplify Hosting**: Automatic deployments from GitHub
- **AWS ECS/EKS**: Container-based deployment
- **AWS Lambda + API Gateway**: Serverless deployment (with adjustments)

## 🐛 Troubleshooting

### Application won't start
```bash
# Check PM2 logs
pm2 logs artistkatta

# Check if port 3000 is in use
sudo lsof -i :3000

# Check Node.js version
node --version  # Should be 18+
```

### Can't access from browser
```bash
# Check if app is running
pm2 status

# Check security groups in AWS Console
# Ensure port 3000 (or 80) is open

# Check if Nginx is running (if using)
sudo systemctl status nginx
```

### Environment variables not working
```bash
# Verify .env.local exists
ls -la .env.local

# Check PM2 environment
pm2 env artistkatta

# Restart after changes
pm2 restart artistkatta
```

### Build fails
```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📞 Support

For issues:
1. Check PM2 logs: `pm2 logs artistkatta`
2. Check system logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify security group settings in AWS Console
4. Ensure all environment variables are set correctly

---

**Congratulations!** 🎉 Your ArtistKatta application should now be running on EC2!

Access it at: `http://YOUR_EC2_PUBLIC_IP:3000` or `http://your-domain.com` (if using Nginx)


