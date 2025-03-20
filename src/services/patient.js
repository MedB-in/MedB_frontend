import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get appointments.
export const getAppointments = (doctor, page, search) =>
    axios.get(`/api/patient/appointment/${page}?search=${search}&doctor=${doctor}`, getHeaders());

//API to add patient from clinic.
export const addPatient = (data) =>
    axios.post("/api/patient/", data, getHeaders());

//API to update patient from clinic.
export const updatePatient = (data) =>
    axios.put("/api/patient/", data, getHeaders());

//API to fetch medical history of a patient.
export const getPatientMedHistory = (patientId, doctorId) =>
    axios.get(`/api/patient/medicalHistory/${patientId}?doctorId=${doctorId}`, getHeaders());

//API to add medical history of a patient.
export const updatePatientMedHistory = (patientId, doctorId, date, appointmentId, data) =>
    axios.post(`/api/patient/medicalHistory/${patientId}?doctorId=${doctorId}&appointmentDate=${date}&appointmentId=${appointmentId}`, data, getHeaders());