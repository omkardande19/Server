"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, File, Image, FileText, Video, Music } from 'lucide-react';
import { ALLOWED_FILE_TYPES, validateFile } from '@/lib/s3-upload';

interface FileUploadProps {
  onUploadComplete: (url: string, key: string) => void;
  onUploadError?: (error: string) => void;
  folder?: string;
  maxSizeMB?: number;
  allowedTypes?: string[];
  accept?: string;
  multiple?: boolean;
  className?: string;
  children?: React.ReactNode;
  showPreview?: boolean;
  existingFile?: string;
  onRemove?: () => void;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  folder = 'images',
  maxSizeMB = 10,
  allowedTypes,
  accept,
  multiple = false,
  className = '',
  children,
  showPreview = true,
  existingFile,
  onRemove,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingFile || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Determine allowed file types
  const fileTypes = allowedTypes || ALLOWED_FILE_TYPES[folder as keyof typeof ALLOWED_FILE_TYPES] || ALLOWED_FILE_TYPES.images;
  const acceptString = accept || fileTypes.join(',');

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Only handle first file for now
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate file
      const validation = validateFile(file, fileTypes, maxSizeMB);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Create preview URL
      if (showPreview && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      // Update preview URL to the uploaded file URL
      if (showPreview) {
        setPreviewUrl(result.url);
      }

      onUploadComplete(result.url, result.key);

      toast({
        title: 'Upload Successful',
        description: `${file.name} has been uploaded successfully.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: errorMessage,
      });

      onUploadError?.(errorMessage);
      
      // Reset preview on error
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [folder, fileTypes, maxSizeMB, showPreview, onUploadComplete, onUploadError, toast, previewUrl]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onRemove?.();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-8 w-8" />;
    if (fileType.startsWith('video/')) return <Video className="h-8 w-8" />;
    if (fileType.startsWith('audio/')) return <Music className="h-8 w-8" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`relative border-2 border-dashed transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="p-6 text-center">
          {children || (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Upload {folder === 'images' ? 'Image' : folder === 'resumes' ? 'Resume' : 'File'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop your file here, or click to browse
              </p>
            </>
          )}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            Choose File
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptString}
            multiple={multiple}
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          <p className="text-xs text-gray-400 mt-2">
            Max size: {maxSizeMB}MB • Allowed: {fileTypes.map(type => type.split('/')[1]).join(', ')}
          </p>
        </div>
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-64 space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center">Uploading... {uploadProgress}%</p>
            </div>
          </div>
        )}
      </Card>

      {/* Preview */}
      {showPreview && previewUrl && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(previewUrl.includes('blob:') ? 'image/' : '')}
              <div>
                <p className="font-medium">File uploaded</p>
                <p className="text-sm text-gray-500">
                  {previewUrl.includes('blob:') ? 'Preview' : 'Ready'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {previewUrl.startsWith('http') && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(previewUrl, '_blank')}
                >
                  View
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Specialized upload components
export function ImageUpload(props: Omit<FileUploadProps, 'folder' | 'allowedTypes'>) {
  return (
    <FileUpload
      {...props}
      folder="images"
      allowedTypes={ALLOWED_FILE_TYPES.images}
      accept="image/*"
    />
  );
}

export function ResumeUpload(props: Omit<FileUploadProps, 'folder' | 'allowedTypes'>) {
  return (
    <FileUpload
      {...props}
      folder="resumes"
      allowedTypes={ALLOWED_FILE_TYPES.resumes}
      accept=".pdf,.doc,.docx"
    />
  );
}

export function DocumentUpload(props: Omit<FileUploadProps, 'folder' | 'allowedTypes'>) {
  return (
    <FileUpload
      {...props}
      folder="documents"
      allowedTypes={ALLOWED_FILE_TYPES.documents}
      accept=".pdf,.doc,.docx,.txt"
    />
  );
}

export function VideoUpload(props: Omit<FileUploadProps, 'folder' | 'allowedTypes'>) {
  return (
    <FileUpload
      {...props}
      folder="videos"
      allowedTypes={ALLOWED_FILE_TYPES.videos}
      accept="video/*"
    />
  );
}

export function AudioUpload(props: Omit<FileUploadProps, 'folder' | 'allowedTypes'>) {
  return (
    <FileUpload
      {...props}
      folder="audio"
      allowedTypes={ALLOWED_FILE_TYPES.audio}
      accept="audio/*"
    />
  );
}
