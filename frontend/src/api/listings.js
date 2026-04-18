import axiosInstance from './axios';

export const getListings = (params = {}, config = {}) => {
    return axiosInstance.get('/api/listings/', { params, ...config });
};

export const getListing = (id) => {
    return axiosInstance.get(`/api/listings/${id}/`);
};

export const createListing = (data) => {
    return axiosInstance.post('/api/listings/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateListing = (id, data) => {
    return axiosInstance.patch(`/api/listings/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteListing = (id) => {
    return axiosInstance.delete(`/api/listings/${id}/`);
};

export const getMyListings = (params = {}) => {
    return axiosInstance.get('/api/listings/mine/', { params });
};

export const getCategories = () => {
    return axiosInstance.get('/api/listings/categories/');
};