import { apiClient } from '@shared/api/client';

export const assignmentApi = {
  create: async (data) => {
    const response = await apiClient.post('/assignments', data);
    return response;
  },

  getMy: async (params = {}) => {
    const response = await apiClient.get('/assignments/my', { params });
    return response;
  },

  getClient: async (params = {}) => {
    const response = await apiClient.get('/assignments/client', { params });
    return response;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/assignments/${id}`);
    return response;
  },

  getByProjectId: async (projectId) => {
    const response = await apiClient.get(`/assignments/project/${projectId}`);
    return response;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/assignments/${id}`, data);
    return response;
  },

  complete: async (id) => {
    const response = await apiClient.post(`/assignments/${id}/complete`);
    return response;
  },

  cancel: async (id) => {
    const response = await apiClient.post(`/assignments/${id}/cancel`);
    return response;
  },
};

