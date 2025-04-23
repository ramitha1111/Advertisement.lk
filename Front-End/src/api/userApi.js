// userApi.js
import api from '../axios';

export const getAllUsers = async (token) => {
  return await api.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserById = async (userId, token) => {
  const response = await api.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createUser = async (userData, token) => {
  const response = await api.put(`/users`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateUser = async (userId, userData, token) => {
  const response = await api.put(`/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteUser = async (userId, token) => {
  const response = await api.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
