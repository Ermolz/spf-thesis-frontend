import { apiClient } from '@shared/api/client';

export const proposalApi = {
  create: async (data) => {
    const response = await apiClient.post('/proposals', data);
    return response;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/proposals/${id}`);
    return response;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/proposals/${id}`, data);
    return response;
  },

  getMy: async (params = {}) => {
    const response = await apiClient.get('/proposals/my', { params });
    return response;
  },

  getByProjectId: async (projectId, params = {}) => {
    const response = await apiClient.get(`/proposals/project/${projectId}`, { params });
    return response;
  },

  accept: async (id) => {
    const response = await apiClient.post(`/proposals/${id}/accept`);
    return response;
  },

  reject: async (id) => {
    const response = await apiClient.post(`/proposals/${id}/reject`);
    return response;
  },

  withdraw: async (id) => {
    const response = await apiClient.post(`/proposals/${id}/withdraw`);
    return response;
  },
};

