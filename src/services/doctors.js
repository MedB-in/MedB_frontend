import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get Doctors.
export const getDoctors = () =>
    axios.get("/api/doctor/", getHeaders());

//API to handle get Active Doctors.
export const getActiveDoctors = (clinicId, page, search) =>
    axios.get(`/api/doctor/list/${clinicId}/${page}?searchQuery=${search}`, getHeaders());

//API to handle Doctor slots.
export const getDoctorSlots = (clinicId, doctorId, date, day) =>
    axios.get(`/api/doctor/slots/${clinicId}/${doctorId}/${date}/${day}`, getHeaders());

//API to Book a slot.
export const bookSlot = (data) =>
    axios.post("/api/doctor/slots", data, getHeaders());

//API to handle get Doctors list.
export const getDoctorList = () =>
    axios.get("/api/doctor/list", getHeaders());

//API to handle Add Doctors to Clinics.
export const addDoctorClinic = (id, data) =>
    axios.post(`/api/doctor/doctorClinic/${id}`, data, getHeaders());

//API to handle add Doctors.
export const addDoctor = (data) =>
    axios.post("/api/doctor/", data, getHeaders());

//API to handle edit Doctors.
export const editDoctor = (id, data) =>
    axios.put(`/api/doctor/${id}`, data, getHeaders());