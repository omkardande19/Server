import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, validateFile, getFolderForFileType, ALLOWED_FILE_TYPES } from '@/lib/s3-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Determine folder if not provided
    const uploadFolder = folder || getFolderForFileType(file.type);
    
    // Validate file type and size
    const allowedTypes = Object.values(ALLOWED_FILE_TYPES).flat();
    const validation = validateFile(file, allowedTypes, 10); // 10MB max
    
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }
    
    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    
    // Upload to S3
    const uploadResult = await uploadToS3({
      folder: uploadFolder,
      filename: file.name,
      contentType: file.type,
      file: buffer,
    });
    
    if (!uploadResult.success) {
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      key: uploadResult.key,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
    
  } catch (error) {
    console.error('[Upload API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'presigned') {
      const folder = searchParams.get('folder');
      const filename = searchParams.get('filename');
      const contentType = searchParams.get('contentType');
      
      if (!folder || !filename || !contentType) {
        return NextResponse.json(
          { success: false, error: 'Missing required parameters' },
          { status: 400 }
        );
      }
      
      // Generate presigned URL for direct upload
      const { generatePresignedUrl } = await import('@/lib/s3-upload');
      const result = await generatePresignedUrl(folder, filename, contentType);
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        presignedUrl: result.url,
        key: result.key,
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('[Upload API] GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
