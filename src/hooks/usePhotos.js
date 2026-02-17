import { useState, useCallback } from 'react';

export function usePhotos() {
  const [photos, setPhotos] = useState({});

  const addPhotos = useCallback((sectionId, files) => {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => ({
          ...prev,
          [sectionId]: [
            ...(prev[sectionId] || []),
            { name: file.name, data: e.target.result, id: Date.now() + Math.random() },
          ],
        }));
      };
      reader.readAsDataURL(file);
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

  return { photos, addPhotos, removePhoto, getPhotos };
}
