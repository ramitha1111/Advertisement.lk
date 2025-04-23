// userApi.js
import api from '../axios';

export const getAllFavourites = async (token) => {
  const response = await api.get(`/favourites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createFavourite = async (advertisementId, token) => {
  const response = await api.put(`/favourites/${advertisementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteFavourite = async (advertisementId, token) => {
  const response = await api.delete(`/favourites/${advertisementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
