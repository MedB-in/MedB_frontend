import axios, { uploadHeaders, getHeaders } from "./axios";

//API to handle get appointments.
export const getAppointments = (doctor, page, search, clinicId) =>
    axios.get(`/api/patient/appointment/${page}?search=${search}&doctor=${doctor}&clinicId=${clinicId}`, getHeaders());

//API to get filtered Appointments.
export const getFilteredAppointments = (filter) =>
    axios.post(`/api/patient/appointment/filtered`, filter, getHeaders());

//API to handle get doctor and clinic list for appointments a patient.
export const getDoctorClinicList = () =>
    axios.get("/api/patient/doctorAndClinicList", getHeaders());

//API to add patient from clinic.
export const addPatient = (data) =>
    axios.post("/api/patient/", data, getHeaders());

//API to update patient from clinic.
export const updatePatient = (data) =>
    axios.put("/api/patient/", data, getHeaders());

//API to get prescription of a patient.
export const getPrescriptions = (patientId, doctorId) =>
    axios.get(`/api/patient/prescription/${patientId}/${doctorId}`, getHeaders());

//API to upload prescription of a patient.
export const uploadPrescription = (patientId, doctorId, data) =>
    axios.post(`/api/patient/prescription/${patientId}/${doctorId}`, data, uploadHeaders());

//API to fetch prescription data for a doctor of a patient.
export const getPrescriptionData = (appointmentId) =>
    axios.get(`/api/patient/prescriptionData/${appointmentId}`, getHeaders());

//API for fetching prescription data for patient.
export const getPrescriptionDataForPatient = (patientId) =>
    axios.get(`/api/patient/prescriptionDataForPatient/${patientId}`, getHeaders());

//API to post prescription data for a doctor of a patient.
export const postPrescriptionData = (appointmentId, data) =>
    axios.post(`/api/patient/prescriptionData/${appointmentId}`, data, getHeaders());

//API to update appointment status of a patient.
export const markAppointmentCompleted = (appointmentId, data) =>
    axios.post(`/api/patient/appointment/status/${appointmentId}`, data, getHeaders());