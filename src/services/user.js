import axios, { getHeaders } from "./axios";


//Function to update profile.
export const updateProfile = (data) =>
    axios.put("/api/user/updateProfile", data, getHeaders());