import axios from "./axios";

export const login = async (username, password) => {
    const response = await axios.post("/auth/login/", {
        username,
        password,
    });

    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);

    // Decode the JWT token to store user info
    const token = response.data.access;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem("user", JSON.stringify({
            id: payload.user_id,
            username: payload.username || username,
        }));
    } catch {
        localStorage.setItem("user", JSON.stringify({ username }));
    }

    return response.data;
};

export const register = async (data) => {
    const response = await axios.post("/auth/register/", data);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    window.location.href = "/login";
};