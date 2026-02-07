import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TaskDetailAttachments = ({ attachments, onAddAttachment }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      Array.from(files).forEach(file => {
        onAddAttachment(file);
      });
      setIsUploading(false);
    }, 1000);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragging ? 'border-primary bg-primary-50' : 'border-border'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Icon name="Loader" size={48} className="text-primary animate-spin mb-4" />
            <p className="text-text-secondary mb-2">Uploading files...</p>
          </div>
        ) : (
          <>
            <Icon name="Upload" size={48} color="#CBD5E1" className="mx-auto mb-4" />
            <p className="text-text-secondary mb-2">Drag and drop files here, or click to browse</p>
            <button 
              onClick={handleBrowseClick}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Choose Files
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileInputChange} 
              className="hidden" 
              multiple 
            />
          </>
        )}
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center space-x-3 p-4 border border-border rounded-lg">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center overflow-hidden">
                {attachment.type === 'image' && attachment.url ? (
                  <Image src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon name={attachment.type === 'image' ? 'Image' : 'FileText'} size={24} color="#64748B" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{attachment.name}</p>
                <p className="text-sm text-text-secondary">{attachment.size}</p>
              </div>
              <div className="flex space-x-1">
                <button className="p-2 text-secondary-600 hover:text-text-primary hover:bg-secondary-100 rounded-lg transition-colors duration-200" title="Download">
                  <Icon name="Download" size={16} />
                </button>
                <button className="p-2 text-secondary-600 hover:text-error hover:bg-error-50 rounded-lg transition-colors duration-200" title="Delete">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskDetailAttachments;