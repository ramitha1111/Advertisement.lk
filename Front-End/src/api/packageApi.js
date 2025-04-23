// packageApi.js
import api from '../axios';

// Create a new package (Admin only)
export const createPackage = async (packageData, token) => {
  const response = await api.post('/packages', packageData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Get all packages
export const getAllPackages = async () => {
  const response = await api.get('/packages');
  return response.data;
};

// Get a single package by ID
export const getPackageById = async (packageId) => {
  const response = await api.get(`/packages/${packageId}`);
  return response.data;
};

// Get all active packages
export const getActivePackages = async () => {
  const response = await api.get('/packages/active');
  return response.data;
};

// Update a package by ID (Admin only)
export const updatePackage = async (packageId, packageData, token) => {
  const response = await api.put(`/packages/${packageId}`, packageData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete a package by ID (Admin only)
export const deletePackage = async (packageId, token) => {
  const response = await api.delete(`/packages/${packageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Buy a package (User)
export const buyPackage = async (packageId, token) => {
  const response = await api.post(`/packages/buy/${packageId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Renew the current user's package
export const renewPackage = async (token) => {
  const response = await api.post('/packages/renew', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
