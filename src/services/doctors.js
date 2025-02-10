import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get Doctors.
export const getDoctors = () =>
    axios.get("/api/doctor/", getHeaders());

//API to handle add Doctors.
export const addDoctor = (data) =>
    axios.post("/api/doctor/", data, getHeaders());

//API to handle edit Doctors.
export const editDoctor = (id, data) =>
    axios.put(`/api/doctor/${id}`, data, getHeaders());