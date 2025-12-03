import { apiClient } from '@shared/api/client';

export const authApi = {
  login: async (data) => {
    const response = await apiClient.post('/auth/login', data);
    return response;
  },

  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response;
  },
};

export const profileApi = {
  getFreelancerProfile: async () => {
    const response = await apiClient.get('/profiles/freelancer/me');
    return response;
  },

  getClientProfile: async () => {
    const response = await apiClient.get('/profiles/client/me');
    return response;
  },

  getFreelancerById: async (userId) => {
    const response = await apiClient.get(`/profiles/freelancer/${userId}`);
    return response;
  },

  getClientById: async (userId) => {
    const response = await apiClient.get(`/profiles/client/${userId}`);
    return response;
  },

  updateFreelancerProfile: async (data) => {
    const response = await apiClient.put('/profiles/freelancer/me', data);
    return response;
  },

  updateClientProfile: async (data) => {
    const response = await apiClient.put('/profiles/client/me', data);
    return response;
  },

  searchFreelancers: async (params = {}) => {
    const response = await apiClient.get('/profiles/freelancers/search', { params });
    return response;
  },

  uploadPortfolio: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/profiles/freelancer/portfolio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },
};

export const clientApi = {
  getVerifiedFreelancers: async (params = {}) => {
    const response = await apiClient.get('/clients/me/freelancers', { params });
    return response;
  },
};

export const fileApi = {
  downloadAttachment: async (attachmentId) => {
    const response = await apiClient.get(`/files/attachments/${attachmentId}`, {
      responseType: 'blob',
    });
    return response;
  },
};

