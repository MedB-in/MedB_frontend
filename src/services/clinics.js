import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get Clinics.
export const getClinic = (id = null) => {
    const url = id ? `/api/clinic/${id}` : "/api/clinic/";
    return axios.get(url, getHeaders());
};

//API to get active cliniics.
export const getActiveClinics = (page, search) => 
    axios.get(`/api/clinic/list/${page}?searchQuery=${search}`, getHeaders());  

//API to handle get Clinics list.
export const getClinicList = () => 
    axios.get("/api/clinic/list", getHeaders()); 

//API to handle add Clinics.
export const addClinic = (data) =>
    axios.post("/api/clinic/", data, getHeaders());

//API to handle edit Clinics.
export const editClinic = (id, data) =>
    axios.put(`/api/clinic/${id}`, data, getHeaders());

//API to get a specific Doctor with a specific Clinic details.
export const getDoctorClinic = (clinicId, doctorId) =>
    axios.get(`/api/clinic/doctorClinic/${clinicId}/${doctorId}`, getHeaders());

//API to set a Doctor Clinic status.
export const setIsDoctorClinicStatus = (doctorId, clinicId, isActive) =>
    axios.put(`/api/clinic/doctorClinic/${clinicId}/${doctorId}`, { isActive }, getHeaders());

//API to get slots of a specific Doctor with a specific Clinic details.
export const getSlots = (clinicId, doctorId) =>
    axios.get(`/api/clinic/slots/${clinicId}/${doctorId}`, getHeaders());

//API to add slots of a specific Doctor with a specific Clinic details.
export const addSlots = (data) =>
    axios.post("/api/clinic/slots", data, getHeaders());

//API to edit slots of a specific Doctor with a specific Clinic details.
export const editSlot = (id, data) =>
    axios.put(`/api/clinic/slots/${id}`, data, getHeaders());

//API to fetch Users of a specific Clinic.
export const getClinicUsers = (clinicId) =>
    axios.get(`/api/clinic/users/${clinicId}`, getHeaders());

//API to add Users to a specific Clinic.
export const addClinicUser = (clinicId, data) =>
    axios.post(`/api/clinic/users/${clinicId}`, data, getHeaders());