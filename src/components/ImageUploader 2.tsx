'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Upload, X, ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  onUploadSuccess: (publicUrl: string) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  bucket?: 'products' | 'avatars';
  className?: string;
}

interface UploadState {
  file: File;
  preview: string;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export default function ImageUploader({
  onUploadSuccess,
  maxFiles = 1,
  acceptedFileTypes = '.jpg,.jpeg,.png,.webp',
  bucket = 'products',
  className = '',
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setUploadState({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'uploading',
      });

      // Step 1: Get signed upload URL
      const response = await fetch('/api/upload-signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          fileName: file.name,
          bucket,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get upload URL');
      }

      const { signedUrl, publicUrl } = await response.json();

      // Step 2: Upload file to signed URL with progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadState(prev => prev ? { ...prev, progress } : null);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('PUT', signedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      // Step 3: Update state and call success callback
      setUploadState(prev => prev ? { ...prev, status: 'success', progress: 100 } : null);
      onUploadSuccess(publicUrl);

      // Auto-clear success state after 3 seconds
      setTimeout(() => {
        setUploadState(null);
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadState(prev => prev ? {
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
        progress: 0
      } : null);

      // Auto-clear error state after 5 seconds
      setTimeout(() => {
        setUploadState(null);
      }, 5000);
    }
  }, [bucket, onUploadSuccess]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive: dropzoneDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles,
    multiple: maxFiles > 1,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const clearUpload = () => {
    if (uploadState?.preview) {
      URL.revokeObjectURL(uploadState.preview);
    }
    setUploadState(null);
  };

  const renderDropzone = () => {
    if (uploadState?.status === 'uploading' || uploadState?.status === 'success') {
      return (
        <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
          {/* Preview Image */}
          {uploadState.preview && (
            <Image
              src={uploadState.preview}
              alt="Upload preview"
              fill
              className="object-cover"
            />
          )}

          {/* Progress Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              {uploadState.status === 'uploading' ? (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <div className="text-sm font-medium mb-2">Uploading...</div>
                  <div className="w-48 bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadState.progress}%` }}
                    />
                  </div>
                  <div className="text-xs">{uploadState.progress}%</div>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 mx-auto mb-2 text-green-400">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-sm font-medium">Upload Complete!</div>
                </>
              )}
            </div>
          </div>

          {/* Cancel Button */}
          {uploadState.status === 'uploading' && (
            <button
              onClick={clearUpload}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              aria-label="Cancel upload"
              title="Cancel upload"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    }

    if (uploadState?.status === 'error') {
      return (
        <div className="w-full h-64 border-2 border-dashed border-red-300 rounded-lg flex items-center justify-center bg-red-50">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="text-red-700 font-medium mb-2">Upload Failed</div>
            <div className="text-red-600 text-sm mb-4">{uploadState.error}</div>
            <button
              onClick={clearUpload}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        {...getRootProps()}
        className={`w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors touch-manipulation ${
          dropzoneDragActive || isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${className}`}
      >
        <input {...getInputProps()} />
        <div className="h-full flex flex-col items-center justify-center p-6">
          <div className={`w-12 h-12 mb-4 ${
            dropzoneDragActive || isDragActive ? 'text-blue-500' : 'text-gray-400'
          }`}>
            {dropzoneDragActive || isDragActive ? (
              <Upload className="w-full h-full" />
            ) : (
              <ImageIcon className="w-full h-full" />
            )}
          </div>
          <div className="text-center">
            <p className={`text-lg font-medium mb-1 ${
              dropzoneDragActive || isDragActive ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {dropzoneDragActive || isDragActive ? 'Drop image here' : 'Drag & drop an image'}
            </p>
            <p className="text-gray-500 text-sm mb-4">or click to browse</p>
            <p className="text-gray-400 text-xs">
              Supports: {acceptedFileTypes.replace(/\./g, '').toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {renderDropzone()}

      {/* Mobile-specific instructions */}
      <div className="mt-2 text-center md:hidden">
        <p className="text-xs text-gray-500">
          Tap to select image from gallery
        </p>
      </div>
    </div>
  );
}
