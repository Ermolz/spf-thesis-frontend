import { apiClient } from '@shared/api/client';

export const projectApi = {
  search: async (params = {}) => {
    const config = {
      params: {},
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
          const value = params[key];
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              value.forEach((item) => searchParams.append(key, item.toString()));
            } else {
              searchParams.append(key, value.toString());
            }
          }
        });
        return searchParams.toString();
      },
    };
    
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        config.params[key] = params[key];
      }
    });
    
    const response = await apiClient.get('/projects/search', config);
    return response;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response;
  },

  create: async (data) => {
    const response = await apiClient.post('/projects', data);
    return response;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response;
  },

  publish: async (id) => {
    const response = await apiClient.post(`/projects/${id}/publish`);
    return response;
  },

  inviteFreelancer: async (projectId, data) => {
    const response = await apiClient.post(`/projects/${projectId}/invite`, data);
    return response;
  },

  getMy: async (params = {}) => {
    const response = await apiClient.get('/projects/my', { params });
    return response;
  },
};

