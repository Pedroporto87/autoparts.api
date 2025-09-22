import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error?.response?.status === 401) {
            const here = window.location.pathname;
            if (!["/login", "/register", "/"].includes(here)) {
                // window.location.href = "/login"; // deixe comentado por enquanto
              }
        }
        return Promise.reject(error);
    }
)

export default api