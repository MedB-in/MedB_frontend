import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get subscriptions.
export const getSubscriptions = (page, search) =>
    axios.get(`/api/subscription/${page}?search=${search}`, getHeaders());