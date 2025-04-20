import api from '../axios';

// Create Advertisement (requires authentication)
export const createAdvertisement = async (adData, token) => {
  const response = await api.post('/advertisements', adData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get All Advertisements (public)
export const getAllAdvertisements = async () => {
  const response = await api.get('/advertisements');
  return response.data;
};

// Get Advertisement by ID (public)
export const getAdvertisementById = async (id) => {
  const response = await api.get(`/advertisements/id/${id}`);
  return response.data;
};

// Get Advertisements by User ID (requires authentication)
export const getAdvertisementsByUser = async (token) => {
  const response = await api.get('/advertisements/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update Advertisement (requires authentication)
export const updateAdvertisement = async (id, adData, token) => {
  const response = await api.put(`/advertisements/${id}`, adData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete Advertisement (requires authentication)
export const deleteAdvertisement = async (id, token) => {
  const response = await api.delete(`/advertisements/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get Advertisements by Category (public)
export const getAdvertisementsByCategory = async (categoryId) => {
  const response = await api.get(`/advertisements/category/${categoryId}`);
  return response.data;
};

// Search Advertisements (public)
export const searchAdvertisements = async (searchQuery) => {
  const response = await api.get(`/advertisements/search/${searchQuery}`);
  return response.data;
};

// Filter Advertisements (public)
export const filterAdvertisements = async (category, location, priceRange) => {
  const response = await api.get(`/advertisements/filter/${category}/${location}/${priceRange}`);
  return response.data;
};

// Get Favourite Advertisements by User ID (public or private depending on route protection)
export const getFavouriteAdvertisements = async (userId) => {
  const response = await api.get(`/advertisements/favourites/${userId}`);
  return response.data;
};

// Get Renewable Advertisements (requires authentication)
export const getRenewableAdvertisements = async (token) => {
  const response = await api.get('/advertisements/renewable', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
