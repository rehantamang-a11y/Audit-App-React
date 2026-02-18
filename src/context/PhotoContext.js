import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

const PhotoContext = createContext(null);

const PHOTO_STORAGE_KEY = 'bathroomAuditPhotos';
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB warning threshold

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 1200;
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressed);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function loadPhotos() {
  try {
    const raw = localStorage.getItem(PHOTO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePhotos(photos) {
  const json = JSON.stringify(photos);
  if (json.length > MAX_PHOTO_SIZE) {
    console.warn('Photo storage exceeding 5MB');
  }
  localStorage.setItem(PHOTO_STORAGE_KEY, json);
}

export function PhotoProvider({ children }) {
  const [photos, setPhotos] = useState(loadPhotos);
  const [photoError, setPhotoError] = useState(null);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  // Persist photos whenever they change; surface storage errors to the user
  useEffect(() => {
    try {
      savePhotos(photos);
    } catch {
      setPhotoError('Storage full — the last photo was not saved. Please remove some photos and try again.');
    }
  }, [photos]);

  const addPhotos = useCallback((sectionId, files) => {
    Array.from(files).forEach(async (file) => {
      const compressed = await compressImage(file);
      setPhotos(prev => ({
        ...prev,
        [sectionId]: [
          ...(prev[sectionId] || []),
          { name: file.name, data: compressed, id: Date.now() + Math.random() },
        ],
      }));
    });
  }, []);

  const removePhoto = useCallback((sectionId, photoId) => {
    setPhotos(prev => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).filter(p => p.id !== photoId),
    }));
  }, []);

  const getPhotos = useCallback((sectionId) => {
    return photos[sectionId] || [];
  }, [photos]);

  const clearPhotoError = useCallback(() => setPhotoError(null), []);

  const resetPhotos = useCallback(() => {
    clearPhotos();
    setPhotos({});
  }, []);

  return (
    <PhotoContext.Provider value={{ photos, addPhotos, removePhoto, getPhotos, photoError, clearPhotoError, resetPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotoContext() {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error('usePhotoContext must be used within PhotoProvider');
  return ctx;
}

export function clearPhotos() {
  localStorage.removeItem(PHOTO_STORAGE_KEY);
}
