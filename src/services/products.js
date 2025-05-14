import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get products.
export const getProduct = () =>
    axios.get("/api/product/", getHeaders());

//API to handle add product.
export const addProduct = (data) =>
    axios.post("/api/product/", data, getHeaders());

//API to handle edit product.
export const editProduct = (id, data) =>
    axios.put(`/api/product/${id}`, data, getHeaders());

//API to handle get menu.
export const getMenuList = () =>
    axios.get("/api/product/menu", getHeaders());

//API to handle add menu to product.
export const addMenuToProduct = (data) =>
    axios.post("/api/product/menu", data, getHeaders());

//API to change product menu status.
export const productMenuStatus = (id, data) =>
    axios.put(`/api/product/status/${id}`, data, getHeaders());