import axios, { getHeaders, uploadHeaders } from "./axios";

//API to update profile.
export const updateProfile = (data) =>
    axios.put("/api/user/updateProfile", data, getHeaders());

//API to upload profile picture.
export const uploadProfilePicture = (data) =>
    axios.post("/api/user/uploadProfilePicture", data, uploadHeaders());

//API to get clinics list of the user.
export const getClinicsList = (userId) =>
    axios.get(`/api/user/clinicList/${userId}`, getHeaders());

//API to get user list.
export const getUserList = (search, page) =>
    axios.get(`/api/user/userList?search=${search}&page=${page}`, getHeaders());

// API to get users with user rights.
export const getUserRightsList = (page, search) =>
    axios.get(`/api/user/userRights?page=${page}&search=${search}`, getHeaders());

//API to add user rights.
export const addUserRights = (data) =>
    axios.post("/api/user/userRights", data, getHeaders());

//API to edit user rights.
export const editUserRights = (data) =>
    axios.put("/api/user/userRights", data, getHeaders());

//API to send OTP for mobile number verification.
export const sendOtp = (data) =>
    axios.post("/api/user/sendOtp", data, getHeaders());

//API to add mobile phone number.
export const addMobileNumber = (data) =>
    axios.post("/api/user/addMobileNumber", data, getHeaders());

//API to check Session.
export const checkSession = () =>
    axios.get("/api/user/checkSession", getHeaders());

//API to get messages.
export const getMessages = (page, search) =>
    axios.get(`/api/user/messages?page=${page}&search=${search}`, getHeaders());