import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401) {
            const here = window.location.pathname;
            if(here !== "/login" && here !== "/register" && here !== "/") {
                window.location.href = `/login?redirect=${encodeURIComponent(here)}`;
            }
        }
        return Promise.reject(error);
    }
)

export default api