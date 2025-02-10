import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get Clinics.
export const getClinic = () =>
    axios.get("/api/clinic/", getHeaders());

//API to handle add Clinics.
export const addClinic = (data) =>
    axios.post("/api/clinic/", data, getHeaders());

//API to handle edit Clinics.
export const editClinic = (id, data) =>
    axios.put(`/api/clinic/${id}`, data, getHeaders());