import axios from "./axios";

export const login = async (username, password) => {

    const response = await axios.post("/auth/login/", {
        username,
        password,
    });

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    return response.data;
};

export const register = async (data) => {

    const response = await axios.post("/auth/register/", data);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
};