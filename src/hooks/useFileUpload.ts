import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { maxSize = 10 * 1024 * 1024, allowedTypes, onProgress } = options;

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      toast.error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return false;
    }

    // Check file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      setError(`File type ${file.type} is not allowed`);
      toast.error(`File type ${file.type} is not allowed`);
      return false;
    }

    return true;
  }, [maxSize, allowedTypes]);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    if (!validateFile(file)) {
      throw new Error('File validation failed');
    }

    setIsUploading(true);
    setError(null);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
        onProgress?.(i);
      }

      // In real implementation, upload to server here
      // const formData = new FormData();
      // formData.append('file', file);
      // const response = await axios.post('/upload', formData, {
      //   onUploadProgress: (progressEvent) => {
      //     const progress = (progressEvent.loaded / progressEvent.total) * 100;
      //     setProgress(progress);
      //     onProgress?.(progress);
      //   }
      // });

      setUploadedFiles(prev => [...prev, file]);
      toast.success(`${file.name} uploaded successfully!`);
      
      // Return mock URL
      return URL.createObjectURL(file);
    } catch (error) {
      setError('Upload failed');
      toast.error('Upload failed. Please try again.');
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, [validateFile, onProgress]);

  const uploadMultipleFiles = useCallback(async (files: FileList | File[]): Promise<string[]> => {
    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map(file => uploadFile(file));
    return Promise.all(uploadPromises);
  }, [uploadFile]);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
    setError(null);
    setProgress(0);
  }, []);

  return {
    isUploading,
    progress,
    uploadedFiles,
    error,
    uploadFile,
    uploadMultipleFiles,
    clearFiles,
  };
};