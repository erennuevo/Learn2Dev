import axiosInstance from './axios';

export const getProfile = () => {
    return axiosInstance.get('/auth/profile/');
};

export const updateProfile = (data) => {
    return axiosInstance.patch('/auth/profile/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const getPublicProfile = (username) => {
    return axiosInstance.get(`/auth/profile/${username}/`);
};