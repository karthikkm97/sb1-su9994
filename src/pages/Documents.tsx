import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newDocs = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      }));
      setDocuments((prev) => [...prev, ...newDocs]);
      setIsUploading(false);
    }, 1500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={\`border-2 border-dashed rounded-lg p-12 text-center \${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }\`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              Drop your documents here
            </p>
            <p className="text-sm text-gray-500">
              or click to select files to upload
            </p>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="text-center py-4">
          <div className="animate-pulse text-indigo-600">Uploading...</div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Uploaded Documents
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <File className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(doc.size)} •{' '}
                      {doc.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </li>
            ))}
            {documents.length === 0 && (
              <li className="px-4 py-8 sm:px-6 text-center text-gray-500">
                No documents uploaded yet
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};