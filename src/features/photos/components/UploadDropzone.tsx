import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadIcon } from '@radix-ui/react-icons';

interface UploadDropzoneProps {
  onFilesAccepted: (files: File[]) => void;
}

const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onFilesAccepted }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAccepted(acceptedFiles);
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-400'}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center">
        <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-pink-600 font-semibold">drop the files here ...</p>
        ) : (
          <p className="text-gray-500">
            drag 'n' drop some files here, or click to select files
          </p>
        )}
        <p className="text-xs text-gray-400 mt-2">
          (you can also paste images from your clipboard)
        </p>
      </div>
    </div>
  );
};

export default UploadDropzone;
