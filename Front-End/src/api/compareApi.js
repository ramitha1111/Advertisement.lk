// userApi.js
import api from '../axios';

export const getAllCompares = async (userId, token) => {
  const response = await api.get(`/compare/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const createCompare = async (compareData, token) => {
  // compareData: { userId: '...', advertisementId: '...' }
  const response = await api.post(`/compare`, compareData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteCompare = async (userId, adId, token) => {
  const response = await api.delete(`/compare/${adId}/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
