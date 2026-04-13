import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;

        if (
            err.response?.status === 401 &&
            !original._retry &&
            !original.url.includes("/auth/refresh/")
        ) {
            original._retry = true;

            const refresh = localStorage.getItem("refresh");

            if (!refresh) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";
                return Promise.reject(err);
            }

            try {
                const res = await axios.post(
                    "http://127.0.0.1:8000/auth/refresh/",
                    { refresh }
                );

                localStorage.setItem("access", res.data.access);

                original.headers.Authorization =
                    `Bearer ${res.data.access}`;

                return axiosInstance(original);

            } catch (refreshError) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(err);
    }
);

export default axiosInstance;