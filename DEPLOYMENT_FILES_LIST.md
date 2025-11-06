# 🚀 Files to Upload to Server

## **FILES TO ADD (7 new files):**

1. **`lib/s3-upload.ts`** - S3 upload functionality
2. **`app/api/upload/route.ts`** - File upload API endpoint  
3. **`components/file-upload.tsx`** - Upload components
4. **`components/file-upload-test.tsx`** - Test component
5. **`app/test-upload/page.tsx`** - Test page
6. **`S3_SETUP_GUIDE.md`** - Setup documentation
7. **`S3_FILE_UPLOAD_IMPLEMENTATION.md`** - Implementation docs

## **FILES TO REPLACE (2 modified files):**

1. **`app/profile/artist/page.tsx`** - Updated to use MongoDB API instead of AWS API Gateway
2. **`next.config.mjs`** - Added S3 image domains to remotePatterns

## **ENVIRONMENT VARIABLES TO SET ON SERVER:**
```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=artistkatta-uploads
```

## **AFTER UPLOADING:**
```bash
npm run build
pm2 restart artistkatta
```

## **KEY CHANGES MADE:**

### 1. **Profile Save Fixed:**
- Removed AWS API Gateway endpoint
- Now uses `updateUserProfile()` from `@/lib/api`
- Calls your MongoDB backend at `/api/users/profile`
- Includes all profile fields (images, bio, category-specific data)

### 2. **S3 Image Support:**
- Added S3 bucket domains to Next.js image config
- Images from S3 will now render properly

### 3. **Complete Profile Data:**
- All category-specific fields included in save payload
- Profile images, cover images, resumes will be saved to MongoDB
- Session storage updated after successful save

**Total: 9 files (7 new + 2 modified)**


