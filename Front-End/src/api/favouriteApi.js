// userApi.js
import api from '../axios';

export const getAllFavourites = async (token,userId) => {
  const response = await api.get(`/favourites/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const createFavourite = async (advertisementId, token) => {
    console.log("id " ,advertisementId, " token " , token)
  const response = await api.post(`/favourites/${advertisementId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteFavourite = async (advertisementId, token) => {
  const response = await api.delete(`/favourites/${advertisementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
