import axios from "axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

const environment = import.meta.env.VITE_REACT_APP_ENVIRONMENT;
const development = import.meta.env.VITE_REACT_APP_DEVELOPMENT_URL;
const test = import.meta.env.VITE_REACT_APP_TEST_URL;
const production = import.meta.env.VITE_REACT_APP_PRODUCTION_URL;

const baseURL = environment === "dev" ? development :
    environment === "test" ? test :
        production;


const axiosInstance = axios.create({
    baseURL: baseURL,
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

const sessionExpired = async () => {
    await Swal.fire({
        icon: 'warning',
        title: 'Session Expired !',
        text: 'Session has expired due to inactivity or timeout. Please log in again.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then(() => {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && /[a-zA-Z]/.test(key)) {
                sessionStorage.removeItem(key);
                i--;
            }
        }
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && /[a-zA-Z]/.test(key)) {
                localStorage.removeItem(key);
                i--;
            }
        }
        sessionStorage.setItem('navStack', JSON.stringify([]));
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    });
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
                await sessionExpired();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
export { uploadHeaders, getHeaders, getToken };