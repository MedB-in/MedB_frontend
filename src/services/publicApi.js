import axios from "./axios";

//API to handle get products.
export const getActiveClinics = (search) =>
    axios.get(`/api/public/activeClinics?searchQuery=${search}`);

//API to handle get Doctors of a specific Clinic.
export const getClinicDoctors = (clinicId) =>
    axios.get(`/api/public/clinicDoctors/${clinicId}`);

//API to handle get Doctors.
export const getDoctor = (clinicId, doctorId) =>
    axios.get(`/api/public/doctorProfile/${clinicId}/${doctorId}`);

//API to handle Doctor slots.
export const getDoctorSlots = (clinicId, doctorId, date, day) =>
    axios.get(`/api/public/slots/${clinicId}/${doctorId}/${date}/${day}`);