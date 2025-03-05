import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get appointments.
export const getAppointments = (page, search) =>
    axios.get(`/api/patient/appointment/${page}?search=${search}`, getHeaders());

//API to add patient from clinic.
export const addPatient = (data) =>
    axios.post("/api/patient/", data, getHeaders());

//API to update patient from clinic.
export const updatePatient = (data) =>
    axios.put("/api/patient/", data, getHeaders());