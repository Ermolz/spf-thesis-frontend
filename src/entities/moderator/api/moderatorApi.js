import { apiClient } from '@shared/api/client';

export const moderatorApi = {
  /**
   * Block a task
   * @param {number} taskId - Task ID
   */
  blockTask: async (taskId) => {
    const response = await apiClient.post(`/moderator/tasks/${taskId}/block`);
    return response;
  },

  /**
   * Unblock a task
   * @param {number} taskId - Task ID
   */
  unblockTask: async (taskId) => {
    const response = await apiClient.post(`/moderator/tasks/${taskId}/unblock`);
    return response;
  },

  /**
   * Block a user
   * @param {number} userId - User ID
   */
  blockUser: async (userId) => {
    const response = await apiClient.post(`/moderator/users/${userId}/block`);
    return response;
  },

  /**
   * Unblock a user
   * @param {number} userId - User ID
   */
  unblockUser: async (userId) => {
    const response = await apiClient.post(`/moderator/users/${userId}/unblock`);
    return response;
  },
};

