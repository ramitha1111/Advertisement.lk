import api from '../axios';

// Create Category (requires FormData for image upload)
export const createCategory = async (categoryData, token) => {
  const response = await api.post('/categories', categoryData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get All Categories (public)
export const getAllCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Get Category by ID (public)
export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Update Category (admin only)
export const updateCategory = async (id, categoryData, token) => {
  const response = await api.put(`/categories/${id}`, categoryData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete Category (admin only)
export const deleteCategory = async (id, token) => {
  const response = await api.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
