import axiosInstance from './axios';

export const getConversations = () => {
    return axiosInstance.get('/api/conversations/');
};

export const createConversation = (listingId, message) => {
    return axiosInstance.post('/api/conversations/', {
        listing_id: listingId,
        message,
    });
};

export const createMeetupConversation = (meetupId, message) => {
    return axiosInstance.post('/api/conversations/', {
        meetup_id: meetupId,
        message,
    });
};

export const getConversation = (id) => {
    return axiosInstance.get(`/api/conversations/${id}/`);
};

export const getMessages = (conversationId, params = {}) => {
    return axiosInstance.get(`/api/conversations/${conversationId}/messages/`, { params });
};

export const sendMessage = (conversationId, content) => {
    return axiosInstance.post(`/api/conversations/${conversationId}/messages/`, { content });
};

export const markMessagesRead = (conversationId) => {
    return axiosInstance.patch(`/api/conversations/${conversationId}/messages/read/`);
};

export const getUnreadCount = () => {
    return axiosInstance.get('/api/conversations/unread/');
};