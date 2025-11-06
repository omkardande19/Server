"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageUpload, ResumeUpload, DocumentUpload } from '@/components/file-upload';
import { useToast } from '@/components/ui/use-toast';

export function FileUploadTest() {
  const [uploadedFiles, setUploadedFiles] = useState<{
    image?: string;
    resume?: string;
    document?: string;
  }>({});
  const { toast } = useToast();

  const handleImageUpload = (url: string, key: string) => {
    setUploadedFiles(prev => ({ ...prev, image: url }));
    toast({
      title: 'Image Uploaded',
      description: `Image uploaded successfully: ${key}`,
    });
  };

  const handleResumeUpload = (url: string, key: string) => {
    setUploadedFiles(prev => ({ ...prev, resume: url }));
    toast({
      title: 'Resume Uploaded',
      description: `Resume uploaded successfully: ${key}`,
    });
  };

  const handleDocumentUpload = (url: string, key: string) => {
    setUploadedFiles(prev => ({ ...prev, document: url }));
    toast({
      title: 'Document Uploaded',
      description: `Document uploaded successfully: ${key}`,
    });
  };

  const handleUploadError = (error: string) => {
    toast({
      variant: 'destructive',
      title: 'Upload Error',
      description: error,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">File Upload Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Image Upload Test</h2>
          <ImageUpload
            onUploadComplete={handleImageUpload}
            onUploadError={handleUploadError}
            folder="test-images"
          />
          {uploadedFiles.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Uploaded Image:</p>
              <img 
                src={uploadedFiles.image} 
                alt="Uploaded" 
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}
        </Card>

        {/* Resume Upload Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Resume Upload Test</h2>
          <ResumeUpload
            onUploadComplete={handleResumeUpload}
            onUploadError={handleUploadError}
            folder="test-resumes"
          />
          {uploadedFiles.resume && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Uploaded Resume:</p>
              <a 
                href={uploadedFiles.resume} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Resume
              </a>
            </div>
          )}
        </Card>

        {/* Document Upload Test */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Document Upload Test</h2>
          <DocumentUpload
            onUploadComplete={handleDocumentUpload}
            onUploadError={handleUploadError}
            folder="test-documents"
          />
          {uploadedFiles.document && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Uploaded Document:</p>
              <a 
                href={uploadedFiles.document} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
            </div>
          )}
        </Card>

        {/* Upload Status */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Status</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Image:</span>
              <span className={uploadedFiles.image ? 'text-green-600' : 'text-gray-400'}>
                {uploadedFiles.image ? '✅ Uploaded' : '❌ Not uploaded'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Resume:</span>
              <span className={uploadedFiles.resume ? 'text-green-600' : 'text-gray-400'}>
                {uploadedFiles.resume ? '✅ Uploaded' : '❌ Not uploaded'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Document:</span>
              <span className={uploadedFiles.document ? 'text-green-600' : 'text-gray-400'}>
                {uploadedFiles.document ? '✅ Uploaded' : '❌ Not uploaded'}
              </span>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4"
            onClick={() => {
              setUploadedFiles({});
              toast({
                title: 'Reset',
                description: 'Upload status cleared',
              });
            }}
          >
            Reset Test
          </Button>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-6 bg-blue-50">
        <h3 className="text-lg font-semibold mb-2">Test Instructions</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Try uploading different file types (images, PDFs, documents)</li>
          <li>Test file size limits (max 10MB)</li>
          <li>Test invalid file types (should show error)</li>
          <li>Check browser network tab for upload progress</li>
          <li>Verify files appear in your S3 bucket</li>
        </ul>
      </Card>
    </div>
  );
}


