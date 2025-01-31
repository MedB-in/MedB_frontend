import axios from "./axios";
import { getHeaders } from "./axios";

// Function to handle login.
export const getMenu = () =>
  axios.get("/api/controlPanel/menu", getHeaders());

// Function to handle logout.
export const editMenu = (data) =>
  axios.post('/api/controlPanel/editMenu', data, getHeaders());
