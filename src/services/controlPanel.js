import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle Add Module
export const addModule = (data) =>
  axios.post("/api/controlPanel/module", data, getHeaders());

//API to handle Edit Module
export const editModule = (id, data) =>
  axios.put(`/api/controlPanel/module/${id}`, data, getHeaders());

// API to handle get menu.
export const getMenu = () =>
  axios.get("/api/controlPanel/menu", getHeaders());

//API to handle add menu.
export const addMenu = (data) =>
  axios.post("/api/controlPanel/menu", data, getHeaders());

// API to handle edit menu.
export const editMenu = (id, data) =>
  axios.put(`/api/controlPanel/menu/${id}`, data, getHeaders());