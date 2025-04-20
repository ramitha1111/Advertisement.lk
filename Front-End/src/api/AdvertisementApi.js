import api from "../axios.js";
/*
export const deleteUser = async (userId, token) => {
    const response = await api.delete(`/users/${userId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};*/


//Get all advertisements
export const getAllAdvertisements = async (token) => {
    const response = await api.get("/advertisements/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
//Get advertisements by userId
export const getAdvertisementsByUserId = async (token) => {
    const response = await api.get("/advertisements/user/", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}




//Update Advertisement
export const updateAdvertisement = async (advertisementId, advertisementData, token) => {
    const response = await api.put(`/advertisements/${advertisementId}`, advertisementData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

//Delete Advertisement
export const deleteAdvertisement = async (advertisementId, token) => {
    const response = await api.delete(`/advertisements/info/${advertisementId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
//Get advertisements by category
export const getAdvertisementsByCategory = async (categoryId, token) => {
    const response = await api.get(`/advertisements/categories/${categoryId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
//Get advertisements by AdvertisementId
export const getAdvertisementsByAdvertisementId = async (advertisementId, token) => {
    const response = await api.get(`/advertisements/${advertisementId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
//Get advertisements by searching
export const getAdvertisementsBySearching = async (search, token) => {
    const response = await api.get(`/advertisements/search/${search}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
//Get renewable advertisements
export const getRenewableAds = async (token) => {
    const response = await api.get("/advertisements/renewable-ads", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;

};
//create advertisement
export const createAdvertisement = async (advertisementData, token) => {
    const response = await api.post("/advertisements/", advertisementData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Important for file uploads
        },
    });




    return response.data;
};



//get advertisements by filtering
export const getAdvertisementsByFiltering = async (category, location, priceRange, token) => {
    const response = await api.get(`/advertisements/filter/${category}/${location}/${priceRange}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;


};

