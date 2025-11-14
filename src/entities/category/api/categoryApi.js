import { apiClient } from '@shared/api/client';

export const categoryApi = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response;
  },
};

