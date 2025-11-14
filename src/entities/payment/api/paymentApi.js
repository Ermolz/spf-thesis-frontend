import { apiClient } from '@shared/api/client';

export const paymentApi = {
  create: async (data) => {
    const response = await apiClient.post('/payments', data);
    return response;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/payments/${id}`);
    return response;
  },

  getMy: async (params = {}) => {
    const response = await apiClient.get('/payments/my', { params });
    return response;
  },

  getClient: async (params = {}) => {
    const response = await apiClient.get('/payments/client', { params });
    return response;
  },

  getByAssignment: async (assignmentId, params = {}) => {
    const response = await apiClient.get(`/payments/assignment/${assignmentId}`, { params });
    return response;
  },

  getBalance: async () => {
    const response = await apiClient.get('/payouts/balance');
    return response.data || response;
  },

  createPayout: async (data) => {
    const response = await apiClient.post('/payouts', data);
    return response;
  },

  getPayoutById: async (id) => {
    const response = await apiClient.get(`/payouts/${id}`);
    return response;
  },

  getMyPayouts: async (params = {}) => {
    const response = await apiClient.get('/payouts/my', { params });
    return response;
  },
};

