import axios, { getHeaders, uploadHeaders } from "./axios";

//API to update profile.
export const updateProfile = (data) =>
    axios.put("/api/user/updateProfile", data, getHeaders());

//API to upload profile picture.
export const uploadProfilePicture = (data) =>
    axios.post("/api/user/uploadProfilePicture", data, uploadHeaders());

//API to get user list.
export const getUserList = (search, page) =>
    axios.get(`/api/user/userList?search=${search}&page=${page}`, getHeaders());

// API to get users with user rights.
export const getUserRightsList = (page) =>
    axios.get(`/api/user/userRights?page=${page}`, getHeaders());

//API to add user rights.
export const addUserRights = (data) =>
    axios.post("/api/user/userRights", data, getHeaders());

//API to edit user rights.
export const editUserRights = (data) =>
    axios.put("/api/user/userRights", data, getHeaders());