import React, { useRef } from 'react';
import './PhotoUpload.css';

export default function PhotoUpload({ sectionId, photos, onAdd, onRemove }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      onAdd(sectionId, e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="photo-upload">
      <label className="upload-btn" onClick={() => inputRef.current?.click()}>
        Add Photos
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />
      <p className="upload-hint">Optional - tap to select multiple photos</p>
      {photos.length > 0 && (
        <div className="photo-preview">
          {photos.map(photo => (
            <div key={photo.id} className="photo-item">
              <img src={photo.data} alt={photo.name} />
              <button
                className="photo-remove"
                onClick={() => onRemove(sectionId, photo.id)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
