import { io } from "socket.io-client";
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

export const reconnectSocketWithNewToken = () => {
    const token = getToken();
    if (socket.connected) {
        socket.disconnect();
    }
    socket.auth = { token };
    socket.connect();
};

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
    console.warn("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
    console.error("Connection error:", error.message);
});

export default socket;
