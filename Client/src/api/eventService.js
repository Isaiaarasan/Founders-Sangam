import axios from "axios";

//const API_URL = "https://founders-sangam.onrender.com";
const API_URL = "https://founders-sangam.onrender.com"; // Using localhost for dev

export const getEventById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/events/${id}`);
        if (response.data.success) {
            return response.data.event;
        }
        return null;
    } catch (error) {
        throw error;
    }
};

export const registerForEvent = async (eventId, registrationData) => {
    try {
        const response = await axios.post(`${API_URL}/events/${eventId}/register`, registrationData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Registration failed";
    }
};

export const getTicketById = async (ticketId) => {
    try {
        const response = await axios.get(`${API_URL}/tickets/${ticketId}`);
        if (response.data.success) {
            return response.data.ticket;
        }
        return null;
    } catch (error) {
        throw error;
    }
};
