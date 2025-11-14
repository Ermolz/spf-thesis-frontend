import { apiClient } from '@shared/api/client';

export const taskApi = {
  create: async (data) => {
    const response = await apiClient.post('/tasks', data);
    return response;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/tasks/${id}`);
    return response;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/tasks/${id}`, data);
    return response;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response;
  },

  getByAssignment: async (assignmentId, params = {}) => {
    const response = await apiClient.get(`/tasks/assignment/${assignmentId}`, { params });
    return response;
  },

  getAttachments: async (taskId) => {
    const response = await apiClient.get(`/tasks/${taskId}/attachments`);
    return response;
  },

  uploadAttachment: async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/tasks/${taskId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  deleteAttachment: async (taskId, attachmentId) => {
    const response = await apiClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    return response;
  },
};

