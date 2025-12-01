import { useState, useCallback } from 'react';
import apiClient from '../utils/apiClient';

export function useInventoryImport(authToken = null) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const importInventory = useCallback(async (file, source, mapping) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', source);
      formData.append('mapping', JSON.stringify(mapping));

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 300);

      const response = await apiClient.request('/api/admin/import-inventory', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        authToken,
      });

      clearInterval(progressInterval);
      setProgress(100);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }, [authToken]);

  return {
    importInventory,
    uploading,
    progress,
    result,
    error,
  };
}
