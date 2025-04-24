import { io } from "socket.io-client";
import axios from "axios";
import axiosInstance, { getToken } from "../services/axios";

const baseURL = axiosInstance.defaults.baseURL;

const socket = io(baseURL, {
    withCredentials: true,
    auth: {
        token: getToken(),
    },
    autoConnect: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

// Refresh token
const refreshAccessToken = async () => {
    try {
        const { data } = await axios.post(`${baseURL}/api/auth/refreshToken`, {}, {
            withCredentials: true,
        });

        localStorage.setItem("accessToken", JSON.stringify(data.accessToken));
        return data.accessToken;
    } catch (err) {
        console.error("Token refresh failed", err);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return null;
    }
};

// Token expiry check
const tokenExpired = (token) => {
    try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
};

// Reconnect with fresh token
export const reconnectSocketWithNewToken = async () => {
    let token = getToken();

    if (!token || tokenExpired(token)) {
        token = await refreshAccessToken();
        if (!token) return;
    }

    if (socket.auth.token === token && socket.connected) {
        return;
    }

    if (socket.connected) {
        socket.disconnect();
    }

    socket.auth = { token };
    socket.connect();
};

// Auto attempt reconnect on token error
socket.on("connect_error", async (error) => {
    console.error("Connection error:", error.message);
    if (error.message.includes("jwt") || error.message.includes("token")) {
        await reconnectSocketWithNewToken();
    }
});

socket.on("connect", () => {
    console.log("Live notification enabled.");
});

socket.on("disconnect", (reason) => {
    console.warn("Live notification disabled:", reason);
});

export default socket;
