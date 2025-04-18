import axios, { uploadHeaders } from "./axios";
import { getHeaders } from "./axios";

//API to handle get Doctors.
export const getDoctors = () =>
    axios.get("/api/doctor/", getHeaders());

//API to handle get Active Doctors.
export const getActiveDoctors = (clinicId, page, search) =>
    axios.get(`/api/doctor/list/active/${clinicId}/${page}?searchQuery=${search}`, getHeaders());

//API to fetch doctor list with minimal doctor details of a specific Clinic.
export const getActiveDoctorsList = (clinicId) =>
    axios.get(`/api/doctor/clinicDoctorsList/${clinicId}`, getHeaders());

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
    axios.post("/api/doctor/", data, uploadHeaders());

//API to handle edit Doctors.
export const editDoctor = (id, data) =>
    axios.put(`/api/doctor/edit/${id}`, data, uploadHeaders());

//API to fetch doctor leave list of a specific Clinic.
export const getDoctorLeaveList = (doctorId, clinicId) =>
    axios.get(`/api/doctor/leave/${doctorId}/${clinicId}`, getHeaders());

//API to post leave of a specific Doctor.
export const postDoctorLeave = (doctorId, clinicId, data) =>
    axios.post(`/api/doctor/leave/${doctorId}/${clinicId}`, data, getHeaders());

//API to update leave of a specific Doctor.
export const updateDoctorLeave = (doctorId, clinicId, leaveId, status) =>
    axios.put(`/api/doctor/leave/${doctorId}/${clinicId}`, { leaveId, status }, getHeaders());

//API to get doctor fee
export const getDoctorFee = (doctorId, clinicId) =>
    axios.get(`/api/doctor/fee/${doctorId}/${clinicId}`, getHeaders());

//API to post doctor fee
export const postDoctorFee = (doctorId, clinicId, data) =>
    axios.post(`/api/doctor/fee/${doctorId}/${clinicId}`, data, getHeaders());