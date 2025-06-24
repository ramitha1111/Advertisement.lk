import api from "../axios.js";


// Get all advertisements
export const getAllAdvertisements = async () => {
  const response = await api.get("/advertisements");
  return response.data;
};

// Get all advertisements
export const getAllAdvertisementsAdmin = async (token) => {
  const response = await api.get("/advertisements/admin", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data;
};

// change the status
export const changeAdvertisementStatus = async (advertisementId, token) => {
  const response = await api.get(`/advertisements/change-status/${advertisementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getMyAdvertisements = async (userId, token) => {

  const response = await api.get(`/advertisements/my/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const getAdvertisementsByUser = async (userId, token) => {

  const response = await api.get(`/advertisements/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get advertisements by user ID (public access)
export const getUserAdvertisementsPublic = async (userId) => {
  const response = await api.get(`/advertisements/user/public/${userId}`);
  return response.data;
};

// Get single advertisement by ID
export const getAdvertisementById = async (advertisementId) => {
  const response = await api.get(`/advertisements/${advertisementId}`);
  return response.data;
};

// Create new advertisement (with image)
export const createAdvertisement = async (advertisementData, token) => {
  const response = await api.post("/advertisements", advertisementData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Important for image uploads
    },
  });
  return response.data;
};

// Update advertisement
export const updateAdvertisement = async (advertisementId, advertisementData, token) => {
  const response = await api.put(`/advertisements/${advertisementId}`, advertisementData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete advertisement
export const deleteAdvertisement = async (advertisementId, token) => {
  const response = await api.delete(`/advertisements/${advertisementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get advertisements by category ID
export const getAdvertisementsByCategory = async (categoryId) => {
  const response = await api.get(`/advertisements/categories/${categoryId}`);
  return response.data;
};

// Search advertisements (by keyword)
export const getAdvertisementsBySearch = async (searchKeyword) => {
  const response = await api.get(`/advertisements/search/${searchKeyword}`);
  return response.data;
};

// Filter advertisements by category, location, and price range
export const getAdvertisementsByFilter = async (category, location, priceRange) => {
  const response = await api.get(`/advertisements/filter/${category}/${location}/${priceRange}`);
  return response.data;
};

// Get advertisements eligible for renewal
export const getRenewableAdvertisements = async (token) => {
  const response = await api.get("/advertisements/renewable-ads", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
