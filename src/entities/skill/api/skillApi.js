import { apiClient } from '@shared/api/client';

export const skillApi = {
  getAll: async () => {
    const response = await apiClient.get('/skills');
    return response;
  },
};

