import axios from "./axios";

//API to handle get Active Clinics.
export const getActiveClinics = (search) =>
    axios.get(`/api/public/activeClinics?searchQuery=${search}`);

//API to get active doctors.
export const getActiveDoctors = (search) =>
    axios.get(`/api/public/activeDoctors?searchQuery=${search}`);

//API to get clinics of a specific Doctor.
export const getDoctorClinics = (doctorId) =>
    axios.get(`/api/public/doctorClinicList/${doctorId}`);

//API to handle get Doctors of a specific Clinic.
export const getClinicDoctors = (clinicId) =>
    axios.get(`/api/public/clinicDoctors/${clinicId}`);

//API to handle get Doctors.
export const getDoctor = (clinicId, doctorId) =>
    axios.get(`/api/public/doctorProfile/${clinicId}/${doctorId}`);

//API to handle Doctor slots.
export const getDoctorSlots = (clinicId, doctorId, date, day) =>
    axios.get(`/api/public/slots/${clinicId}/${doctorId}/${date}/${day}`);