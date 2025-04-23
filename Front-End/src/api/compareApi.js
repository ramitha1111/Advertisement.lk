// userApi.js
import api from '../axios';

export const getAllCompares = async (token) => {
  const response = await api.get(`/compare`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createCompare = async (advertisementId, token) => {
  const response = await api.post(`/compare/${advertisementId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteCompare = async (advertisementId, token) => {
  const response = await api.delete(`/compare/${advertisementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
