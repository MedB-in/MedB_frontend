import axios from "./axios";
import { getHeaders } from "./axios";

//API to handle get subscriptions.
export const getSubscriptions = (page, search) =>
    axios.get(`/api/subscription/${page}?search=${search}`, getHeaders());

//API to add subscription.
export const addSubscription = (data) =>
    axios.post("/api/subscription/addSubscription", data, getHeaders());