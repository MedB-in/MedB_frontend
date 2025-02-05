import axios from "axios";
import { toast } from "react-hot-toast";

const environment = import.meta.env.VITE_REACT_APP_ENVIRONMENT;
const development = import.meta.env.VITE_REACT_APP_DEVELOPMENT_URL;
const test = import.meta.env.VITE_REACT_APP_TEST_URL;
const production = import.meta.env.VITE_REACT_APP_PRODUCTION_URL;

const axiosInstance = axios.create({
    baseURL:
        environment === "dev" ? development :
            environment === "test" ? test :
                production,
    withCredentials: true,
});

const getToken = () => {
    return JSON.parse(localStorage.getItem("accessToken"));
};

//For JSON requests
const getHeaders = () => {

    const token = getToken();
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
};

//For file upload or form data
const uploadHeaders = () => {
    const token = getToken();
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
    };
};

const sessionExpired = () => {
    alert('Session expired. Please log in again.');
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // make sure the status code is not 401 and url isn't the login or logout url
        if (error.response.status !== 401 || originalRequest.url === '/api/auth/login' || originalRequest.url === '/api/auth/logout') {
            if (error.response.status === 403) {
                const errorMessage = error.response.data?.message || 'Access denied';
                toast.error(errorMessage);
                return Promise.reject(error);
            }
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Try to refresh token and retry the original request
            try {
                const { data } = await axios.post(`${environment === "dev" ? development : environment === "test" ? test : production}/api/auth/refreshToken`, {}, { withCredentials: true });

                localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                sessionExpired();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
export { uploadHeaders, getHeaders, getToken };