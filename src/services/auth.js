import axios from "./axios";

// Function to handle login.
export const doLogin = (credentials) =>
  axios.post("/api/auth/login", credentials);

// Function to handle Google login/signup.
export const doGoogleLogin = (credentials) =>
  axios.post("/api/auth/googleLogin", credentials);

// Function to handle OTP login.
export const otpLogin = (mobileNumber) =>
  axios.post("/api/auth/otpLogin", { mobileNumber });

// Function to handle logout.
export const doLogout = (credentials) =>
  axios.post('/api/auth/logout', credentials);

// Function to handle register.
export const doRegister = (credentials) =>
  axios.post("/api/auth/register", credentials);

//Function to verify user email.
export const verifyEmail = (token, userId) =>
  axios.get(`/api/auth/verifyEmail/${token}/${userId}`);

//Function to get reset code for password.
export const getCodeForgotPass = (email) =>
  axios.get(`/api/auth/forgotPassword/${email}`);

//Function to reset password.
export const resetPassword = (data) =>
  axios.post("/api/auth/resetPassword", data);

//Function to resend verification email.
export const sendVerificationEmail = (email) =>
  axios.post(`/api/auth/sendVerificationEmail`, { email });