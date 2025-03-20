import axios from "./axios";

//API to handle get products.
export const getActiveClinics = (search) =>
    axios.get(`/api/public/activeClinics?searchQuery=${search}`);

//API to handle get Doctors of a specific Clinic.
export const getClinicDoctors = (clinicId) =>
    axios.get(`/api/public/clinicDoctors/${clinicId}`);
