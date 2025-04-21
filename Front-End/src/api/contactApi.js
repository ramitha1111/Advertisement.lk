// contactApi.js
import api from '../axios';

// Send a new contact message
export const sendMessage = async (messageData) => {
  const response = await api.post('/contact', messageData);
  return response.data;
};

// Get all messages (for admin)
export const getAllMessages = async (token) => {
  const response = await api.get('/contact', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get message by ID
export const getMessageById = async (messageId, token) => {
  const response = await api.get(`/contact/${messageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete message by ID
export const deleteMessage = async (messageId, token) => {
  const response = await api.delete(`/contact/${messageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
