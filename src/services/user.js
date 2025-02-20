import axios, { getHeaders, uploadHeaders } from "./axios";

//API to update profile.
export const updateProfile = (data) =>
    axios.put("/api/user/updateProfile", data, getHeaders());

//API to upload profile picture.
export const uploadProfilePicture = (data) =>
    axios.post("/api/user/uploadProfilePicture", data, uploadHeaders());