import axiosInstance from './axios';

export const getMeetups = (params = {}, config = {}) => {
    return axiosInstance.get('/api/meetups/', { params, ...config });
};

export const getMeetup = (id) => {
    return axiosInstance.get(`/api/meetups/${id}/`);
};

export const createMeetup = (data) => {
    return axiosInstance.post('/api/meetups/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateMeetup = (id, data) => {
    return axiosInstance.patch(`/api/meetups/${id}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deleteMeetup = (id) => {
    return axiosInstance.delete(`/api/meetups/${id}/`);
};

export const getMyMeetups = (params = {}) => {
    return axiosInstance.get('/api/meetups/mine/', { params });
};

export const getMeetupCategories = () => {
    return axiosInstance.get('/api/meetups/categories/');
};

export const rsvpMeetup = (id, status = 'going') => {
    return axiosInstance.post(`/api/meetups/${id}/rsvp/`, { status });
};

export const cancelRsvp = (id) => {
    return axiosInstance.delete(`/api/meetups/${id}/rsvp/delete/`);
};