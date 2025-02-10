import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get products.
export const getClinic = () =>
    axios.get("/api/clinic/", getHeaders());

//API to handle add product.
export const addClinic = (data) =>
    axios.post("/api/clinic/", data, getHeaders());

//API to handle edit product.
export const editClinic = (id, data) =>
    axios.put(`/api/clinic/${id}`, data, getHeaders());