import { apiClient } from '@shared/api/client';

export const reviewApi = {
  create: async (data) => {
    const response = await apiClient.post('/reviews', data);
    return response;
  },

  getByFreelancer: async (freelancerId, params = {}) => {
    const response = await apiClient.get(`/reviews/freelancer/${freelancerId}`, { params });
    return response;
  },

  getByClient: async (clientId, params = {}) => {
    const response = await apiClient.get(`/reviews/client/${clientId}`, { params });
    return response;
  },

  getByAssignment: async (assignmentId, params = {}) => {
    const response = await apiClient.get(`/reviews/assignment/${assignmentId}`, { params });
    return response;
  },
};

