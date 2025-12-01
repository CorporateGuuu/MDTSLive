import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

export function useInventoryTransfer(apiKey = null) {
  const [transfers, setTransfers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total_records: 0,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransfers = useCallback(async (filters = {}, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        api_key: apiKey,
        page,
        per_page: pagination.per_page,
        ...filters,
      };

      const response = await apiClient.request('/api/inventorytransfer', {
        method: 'GET',
        params,
      });

      setTransfers(response.data.inventoryTransferListData || []);
      setPagination(response.data.pagination || pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiKey, pagination.per_page]);

  const createTransfer = useCallback(async (transferData) => {
    try {
      const response = await apiClient.request('/api/inventorytransfer', {
        method: 'POST',
        body: { ...transferData, api_key: apiKey },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }, [apiKey]);

  const updateTransfer = useCallback(async (transferId, action) => {
    try {
      const response = await apiClient.request('/api/inventorytransfer', {
        method: 'PUT',
        body: { transfer_id: transferId, action, api_key: apiKey },
      });
      return response;
    } catch (err) {
      throw err;
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      fetchTransfers();
    }
  }, [fetchTransfers, apiKey]);

  return {
    transfers,
    pagination,
    loading,
    error,
    fetchTransfers,
    createTransfer,
    updateTransfer,
  };
}
