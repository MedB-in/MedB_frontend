import axios, { getHeaders } from "./axios";


// Get all notifications for a user
export const getNotifications = () =>
    axios.get("/api/notification", getHeaders());

// Delete all notifications
export const deleteAllNotifications = () =>
    axios.delete("/api/notification", getHeaders());

// Mark all notifications as read
export const markAllNotificationsRead = () =>
    axios.patch("/api/notification/markAllRead", {}, getHeaders());

// Mark a single notification as read
export const markNotificationRead = (id) =>
    axios.patch(`/api/notification/${id}`, {}, getHeaders());

// Delete a single notification
export const deleteNotification = (id) =>
    axios.delete(`/api/notification/${id}`, getHeaders());

// Read all notifications
export const readAllNotifications = () =>
    axios.patch("/api/notification/markAllRead", {}, getHeaders());

//Read a single notification
export const readNotification = (id) =>
    axios.patch(`/api/notification/${id}`, {}, getHeaders());