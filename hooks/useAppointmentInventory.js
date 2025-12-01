import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

export function useAppointmentInventory(apiKey = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointmentInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.request('/api/appointment/inventory', {
        method: 'GET',
        params: { api_key: apiKey },
      });
      setData(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      fetchAppointmentInventory();
    }
  }, [fetchAppointmentInventory, apiKey]);

  return {
    data,
    loading,
    error,
    refetch: fetchAppointmentInventory,
  };
}
