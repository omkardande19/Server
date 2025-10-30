# 🚀 S3 File Upload Setup Guide

This guide will help you set up AWS S3 for file uploads in the ArtistKatta application.

## 📋 Prerequisites

1. **AWS Account** - You need an active AWS account
2. **AWS CLI** - Install AWS CLI (optional but recommended)
3. **S3 Bucket** - Create an S3 bucket for file storage

## 🔧 Step 1: Create S3 Bucket

### Using AWS Console:
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. **Bucket name**: `artistkatta-uploads` (or your preferred name)
4. **Region**: `ap-south-1` (Mumbai)
5. **Block Public Access**: Uncheck "Block all public access" (we need public read access)
6. **Bucket Versioning**: Enable (recommended)
7. Click "Create bucket"

### Using AWS CLI:
```bash
aws s3 mb s3://artistkatta-uploads --region ap-south-1
```

## 🔑 Step 2: Create IAM User

### Create IAM User for S3 Access:
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. **Username**: `artistkatta-s3-user`
4. **Access type**: Programmatic access
5. Click "Next: Permissions"

### Attach S3 Policy:
1. Click "Attach existing policies directly"
2. Search for "S3" and select:
   - `AmazonS3FullAccess` (for development)
   - Or create a custom policy (see below)

### Custom S3 Policy (Recommended for Production):
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::artistkatta-uploads/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": "arn:aws:s3:::artistkatta-uploads"
        }
    ]
}
```

## 📝 Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=ap-south-1
S3_BUCKET_NAME=artistkatta-uploads

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:3000
NEXT_PUBLIC_API_URL=http://ec2-15-206-211-190.ap-south-1.compute.amazonaws.com:5001/api
```

## 🛠️ Step 4: Install AWS SDK

The AWS SDK is already included in the project, but if you need to install it:

```bash
npm install aws-sdk
```

## 🔒 Step 5: Configure Bucket Policy

Add this bucket policy to allow public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::artistkatta-uploads/*"
        }
    ]
}
```

### To add the policy:
1. Go to your S3 bucket
2. Click "Permissions" tab
3. Scroll down to "Bucket policy"
4. Paste the policy above
5. Click "Save changes"

## 📁 Step 6: Create Folder Structure

Your S3 bucket should have this folder structure:

```
artistkatta-uploads/
├── images/
│   ├── profile-pictures/
│   ├── cover-images/
│   └── portfolio/
├── resumes/
├── documents/
├── videos/
└── audio/
```

## 🧪 Step 7: Test the Setup

### Test File Upload:
1. Start your development server: `npm run dev`
2. Go to `/profile/artist`
3. Try uploading a profile picture
4. Check your S3 bucket to see if the file was uploaded

### Test API Endpoint:
```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test-image.jpg" \
  -F "folder=images"
```

## 🚨 Troubleshooting

### Common Issues:

#### 1. "Access Denied" Error
- Check your AWS credentials
- Verify IAM user has S3 permissions
- Ensure bucket policy allows public read

#### 2. "Bucket Not Found" Error
- Verify bucket name in environment variables
- Check AWS region is correct
- Ensure bucket exists in the specified region

#### 3. "CORS Configuration" Error
- Add CORS configuration to your S3 bucket:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

#### 4. Files Not Publicly Accessible
- Check bucket policy allows public read
- Verify ACL is set to "public-read" in upload
- Ensure no "Block Public Access" settings

## 🔐 Security Best Practices

### For Production:
1. **Use IAM Roles** instead of access keys when possible
2. **Limit S3 permissions** to only what's needed
3. **Enable CloudTrail** for audit logging
4. **Use HTTPS** for all file access
5. **Implement file size limits** (already done in code)
6. **Scan uploaded files** for malware
7. **Use signed URLs** for sensitive files

### Environment Variables Security:
- Never commit `.env.local` to version control
- Use AWS Secrets Manager for production
- Rotate access keys regularly
- Use least privilege principle

## 📊 Monitoring

### CloudWatch Metrics:
- Monitor S3 request metrics
- Set up billing alerts
- Track storage usage

### Application Logs:
- Check upload success/failure rates
- Monitor file size distributions
- Track upload performance

## 🎯 File Types Supported

### Images:
- JPEG, JPG, PNG, GIF, WebP
- Max size: 10MB
- Folders: `images/`

### Documents:
- PDF, DOC, DOCX, TXT
- Max size: 10MB
- Folders: `resumes/`, `documents/`

### Media:
- Videos: MP4, AVI, MOV, WMV
- Audio: MP3, WAV, M4A, OGG
- Max size: 10MB
- Folders: `videos/`, `audio/`

## 🚀 Deployment Checklist

- [ ] S3 bucket created
- [ ] IAM user created with proper permissions
- [ ] Environment variables configured
- [ ] Bucket policy added
- [ ] CORS configuration set
- [ ] Test uploads working
- [ ] File access URLs working
- [ ] Error handling tested

## 📞 Support

If you encounter issues:
1. Check AWS CloudTrail for API errors
2. Verify environment variables are loaded
3. Test with AWS CLI: `aws s3 ls s3://your-bucket-name`
4. Check browser network tab for upload errors
5. Review server logs for detailed error messages

---

**Status:** ✅ **Ready for Production**
**Last Updated:** October 15, 2025
