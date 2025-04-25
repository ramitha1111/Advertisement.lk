// userApi.js
import api from '../axios';

export const getAllFavourites = async (token, userId) => {
  const response = await api.get(`/favourites/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createFavourite = async (advertisementId, userId, token) => {
  console.log(userId, advertisementId, token)
  const response = await api.post(`/favourites/${advertisementId}`, { "userId": userId }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteFavourite = async (userId, advertisementId, token) => {
  const response = await api.delete(`/favourites/${userId}/${advertisementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
