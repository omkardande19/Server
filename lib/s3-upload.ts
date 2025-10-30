import AWS from 'aws-sdk';

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-south-1',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'artistkatta-uploads';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface FileUploadOptions {
  folder: string;
  filename: string;
  contentType: string;
  file: Buffer | string; // Buffer for binary files, base64 string for API calls
}

/**
 * Upload file to S3 bucket
 */
export async function uploadToS3(options: FileUploadOptions): Promise<UploadResult> {
  try {
    const { folder, filename, contentType, file } = options;
    
    // Generate unique key with timestamp
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${timestamp}_${sanitizedFilename}`;
    
    // Convert base64 to buffer if needed
    let fileBuffer: Buffer;
    if (typeof file === 'string') {
      // Remove data URL prefix if present
      const base64Data = file.replace(/^data:[^;]+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
    } else {
      fileBuffer = file;
    }
    
    // Upload parameters
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read', // Make files publicly accessible
      Metadata: {
        'original-filename': filename,
        'upload-timestamp': timestamp.toString(),
        'upload-folder': folder,
      },
    };
    
    console.log(`[S3] Uploading file: ${key}`);
    const result = await s3.upload(uploadParams).promise();
    
    console.log(`[S3] Upload successful: ${result.Location}`);
    
    return {
      success: true,
      url: result.Location,
      key: result.Key,
    };
  } catch (error) {
    console.error('[S3] Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete file from S3 bucket
 */
export async function deleteFromS3(key: string): Promise<UploadResult> {
  try {
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };
    
    console.log(`[S3] Deleting file: ${key}`);
    await s3.deleteObject(deleteParams).promise();
    
    console.log(`[S3] Delete successful: ${key}`);
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('[S3] Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}

/**
 * Generate presigned URL for direct upload from frontend
 */
export async function generatePresignedUrl(
  folder: string,
  filename: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<UploadResult> {
  try {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${timestamp}_${sanitizedFilename}`;
    
    const presignedParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      Expires: expiresIn,
      ACL: 'public-read',
    };
    
    const presignedUrl = await s3.getSignedUrlPromise('putObject', presignedParams);
    
    return {
      success: true,
      url: presignedUrl,
      key: key,
    };
  } catch (error) {
    console.error('[S3] Presigned URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate presigned URL',
    };
  }
}

/**
 * Get file info from S3
 */
export async function getFileInfo(key: string): Promise<UploadResult> {
  try {
    const headParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };
    
    const result = await s3.headObject(headParams).promise();
    
    return {
      success: true,
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`,
      key: key,
    };
  } catch (error) {
    console.error('[S3] Get file info error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'File not found',
    };
  }
}

/**
 * List files in a folder
 */
export async function listFiles(folder: string, maxKeys: number = 100): Promise<{
  success: boolean;
  files?: Array<{
    key: string;
    url: string;
    size: number;
    lastModified: Date;
    contentType: string;
  }>;
  error?: string;
}> {
  try {
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: `${folder}/`,
      MaxKeys: maxKeys,
    };
    
    const result = await s3.listObjectsV2(listParams).promise();
    
    const files = result.Contents?.map(item => ({
      key: item.Key!,
      url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${item.Key}`,
      size: item.Size || 0,
      lastModified: item.LastModified || new Date(),
      contentType: 'application/octet-stream', // S3 doesn't return content type in list
    })) || [];
    
    return {
      success: true,
      files,
    };
  } catch (error) {
    console.error('[S3] List files error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list files',
    };
  }
}

/**
 * Validate file type and size
 */
export function validateFile(file: File, allowedTypes: string[], maxSizeMB: number = 10): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }
  
  return { valid: true };
}

/**
 * Get folder name based on file type
 */
export function getFolderForFileType(fileType: string): string {
  if (fileType.startsWith('image/')) {
    return 'images';
  } else if (fileType === 'application/pdf') {
    return 'resumes';
  } else if (fileType.includes('document') || fileType.includes('text')) {
    return 'documents';
  } else if (fileType.startsWith('video/')) {
    return 'videos';
  } else if (fileType.startsWith('audio/')) {
    return 'audio';
  } else {
    return 'misc';
  }
}

/**
 * Allowed file types for different upload categories
 */
export const ALLOWED_FILE_TYPES = {
  images: [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
  ],
  resumes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  videos: [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
  ],
  audio: [
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/ogg',
  ],
} as const;
