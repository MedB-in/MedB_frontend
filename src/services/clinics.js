import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get Clinics.
export const getClinic = (id = null) => {
    const url = id ? `/api/clinic/${id}` : "/api/clinic/";
    return axios.get(url, getHeaders());
};

//API to handle get Clinics list.
export const getClinicList = () => 
    axios.get("/api/clinic/list", getHeaders()); 

//API to handle add Clinics.
export const addClinic = (data) =>
    axios.post("/api/clinic/", data, getHeaders());

//API to handle edit Clinics.
export const editClinic = (id, data) =>
    axios.put(`/api/clinic/${id}`, data, getHeaders());