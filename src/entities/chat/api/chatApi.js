import { apiClient } from '@shared/api/client';

export const chatApi = {
  createConversation: async (data) => {
    const response = await apiClient.post('/chat/conversations', data);
    return response;
  },

  getConversations: async () => {
    const response = await apiClient.get('/chat/conversations');
    return response;
  },

  sendMessage: async (data) => {
    const response = await apiClient.post('/chat/messages', data);
    return response;
  },

  getMessages: async (conversationId) => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
    return response;
  },
};

