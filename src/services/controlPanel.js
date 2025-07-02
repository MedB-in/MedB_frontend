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

//API to get Enquiry List
export const getEnquiries = (page) =>
  axios.get(`/api/controlPanel/enquiry?page=${page}`, getHeaders());

//API to resolve Enquiry
export const updateEnquiryStatus = (id, status) =>
  axios.put(`/api/controlPanel/enquiry?id=${id}`, { status }, getHeaders());

//API to get error logs
export const getErrorLogsByUser = (page, date, userId, timeFrom, timeTo) =>
  axios.get(`/api/controlPanel/errorLogs?page=${page}&date=${date}&userId=${userId}&timeFrom=${timeFrom}&timeTo=${timeTo}`, getHeaders());

//API to get audit logs
export const getAuditLogsByUser = (page, date, userId, timeFrom, timeTo) =>
  axios.get(`/api/controlPanel/auditLogs?page=${page}&date=${date}&userId=${userId}&timeFrom=${timeFrom}&timeTo=${timeTo}`, getHeaders());

//API to get email logs
export const getEmailLogsByUser = (page, date, email, timeFrom, timeTo) =>
  axios.get(`/api/controlPanel/emailLogs?page=${page}&date=${date}&email=${email}&timeFrom=${timeFrom}&timeTo=${timeTo}`, getHeaders());