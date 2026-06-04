import React, { useState, useRef } from 'react';
import { uploadMedia } from '../services/api';
import '../styles/DropZone.css';
import Icon from './Icons';

const DropZone = ({
  onFileSelected,
  value,
  onClear,
  accept = 'image/*',
  disabled = false,
  label = 'Image',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || disabled) return;
    if (!file.type.startsWith('image/')) {
      setError('Only image files are accepted');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await uploadMedia(formData);
      onFileSelected(result.url);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onClear();
  };

  const hasValue = Boolean(value);

  return (
    <div className={`dz-wrapper ${disabled ? 'dz-disabled' : ''}`}>
      <label className="dz-label">{label}</label>
      {hasValue && (
        <div className="dz-preview">
          <img src={value} alt={label} className="dz-preview-img" />
          <button
            type="button"
            className="dz-clear"
            onClick={handleClear}
            title={`Remove ${label}`}
          >
            <Icon name="x" size={18} />
          </button>
        </div>
      )}
      <div
        className={`dz-zone ${dragOver ? 'dz-zone-active' : ''} ${uploading ? 'dz-zone-uploading' : ''}`}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled && !uploading) inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled || uploading}
          className="dz-input-hidden"
        />
        <div className="dz-content">
          {uploading ? (
            <span className="dz-spinner"><Icon name="loader" size={20} /></span>
          ) : (
            <span className="dz-icon"><Icon name="camera" size={20} /></span>
          )}
          <span className="dz-text">
            {uploading
              ? 'Uploading...'
              : hasValue
                ? `Drop to replace ${label.toLowerCase()} or click to browse`
                : `Drop image here or click to browse`}
          </span>
        </div>
      </div>
      {error && <div className="dz-error">{error}</div>}
    </div>
  );
};

export default DropZone;
