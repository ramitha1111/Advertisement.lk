import api from '../axios';

// Get site settings
export const getSiteSettings = async (token) => {
    const response = await api.get('/site-settings', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Get homepage categories (public)
export const getHomepageCategories = async () => {
    const response = await api.get('/site-settings/homepage-categories');
    return response.data;
};

// Update homepage categories
export const updateHomepageCategories = async (categories, token) => {
    const response = await api.put('/site-settings/homepage-categories',
        { categories },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// Add a category to homepage
export const addHomepageCategory = async (categoryId, order, token) => {
    const response = await api.post('/site-settings/homepage-categories',
        { categoryId, order },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

// Remove a category from homepage
export const removeHomepageCategory = async (categoryId, token) => {
    const response = await api.delete(`/site-settings/homepage-categories/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

// Reorder homepage categories
export const reorderHomepageCategories = async (categoryOrders, token) => {
    const response = await api.put('/site-settings/homepage-categories/reorder',
        { categoryOrders },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};
