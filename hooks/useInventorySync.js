import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

export function useInventorySync(authToken = null) {
  const [data, setData] = useState({
    products: [],
    lowStockAlerts: [],
    stockUpdates: [],
    metrics: {},
    notifications: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInventorySync = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.request('/api/admin/inventory/sync', {
        method: 'GET',
        authToken,
      });
      setData({
        products: response.products || [],
        lowStockAlerts: response.lowStockAlerts || [],
        stockUpdates: response.stockUpdates || [],
        metrics: response.metrics || {},
        notifications: response.notifications || [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchInventorySync();
  }, [fetchInventorySync]);

  return {
    data,
    loading,
    error,
    refetch: fetchInventorySync,
  };
}
