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

//API to add user rights.
export const addUserRights = (data) =>
    axios.post("/api/user/userRights", data, getHeaders());  