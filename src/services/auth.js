import axios from "./axios";

// Function to handle login.
export const doLogin = (credentials) =>
  axios.post("/api/auth/login", credentials);

// Function to handle logout.
export const doLogout = () =>
  axios.post('/api/auth/logout');
