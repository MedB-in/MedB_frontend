import axios, { uploadHeaders } from "./axios";
import { getHeaders } from "./axios";

// API to get all clinics
export const getAllClinics = (page, search) =>
    axios.get(`/api/clinic?page=${page}&search=${search}`, getHeaders());

// API to get a specific clinic by ID
export const getClinicById = (id) =>
    axios.get(`/api/clinic/byId/${id}`, getHeaders());

//API to get active cliniics.
export const getActiveClinics = (page, search) =>
    axios.get(`/api/clinic/list/${page}?searchQuery=${search}`, getHeaders());

//API to get clinic registrations
export const getClinicRegistrations = (page) =>
    axios.get(`/api/clinic/registrations/${page}`, getHeaders());

//API to approve clinic registration
export const approveClinic = (id) =>
    axios.put(`/api/clinic/registration/approve/${id}`, {}, getHeaders());

//API to reject clinic registration
export const rejectClinic = (id) =>
    axios.put(`/api/clinic/registration/reject/${id}`, {}, getHeaders());

//API to handle get Clinics list.
export const getClinicList = () =>
    axios.get("/api/clinic/clinicList", getHeaders());

//API to handle add Clinics.
export const addClinic = (data) =>
    axios.post("/api/clinic", data, uploadHeaders());

//API to handle edit Clinics.
export const editClinic = (id, data) =>
    axios.put(`/api/clinic/byId/${id}`, data, uploadHeaders());

//API to get a specific Doctor with a specific Clinic details.
export const getDoctorClinic = (clinicId, doctorId) =>
    axios.get(`/api/clinic/doctorClinic/${clinicId}/${doctorId}`, getHeaders());

//API to set a Doctor Clinic status.
export const setIsDoctorClinicStatus = (doctorId, clinicId, isActive) =>
    axios.put(`/api/clinic/doctorClinicStatus/${clinicId}/${doctorId}`, { isActive }, getHeaders());

//API to get slots of a specific Doctor with a specific Clinic details.
export const getSlots = (clinicId, doctorId) =>
    axios.get(`/api/clinic/slots/${clinicId}/${doctorId}`, getHeaders());

//API to add slots of a specific Doctor with a specific Clinic details.
export const addSlots = (data) =>
    axios.post("/api/clinic/slots", data, getHeaders());

//API to edit slots of a specific Doctor with a specific Clinic details.
export const editSlot = (id, data) =>
    axios.put(`/api/clinic/slots/${id}`, data, getHeaders());

//API to delete slots of a specific Doctor with a specific Clinic details.
export const deleteSlot = (id) =>
    axios.delete(`/api/clinic/slots/${id}`, getHeaders());

//API to fetch Users of a specific Clinic.
export const getClinicUsers = (clinicId) =>
    axios.get(`/api/clinic/users/${clinicId}`, getHeaders());

// API to get users with user rights.
export const getClinicUserRightsList = (page, clinicId, search) =>
    axios.get(`/api/clinic/user/userRights?page=${page}&clinicId=${clinicId}&search=${search}`, getHeaders());

//API to edit clinic user rights.
export const editClinicUserRights = (data) =>
    axios.put("/api/clinic/user/userRights", data, getHeaders());

//API to get clinic menus.
export const getClinicMenus = () =>
    axios.get(`/api/clinic/menus`, getHeaders());

//API to add clinic user rights.
export const addClinicUserRights = (data) =>
    axios.post("/api/clinic/user/userRights", data, getHeaders());

//API to add Users to a specific Clinic.
export const addClinicUser = (clinicId, data) =>
    axios.post(`/api/clinic/users/${clinicId}`, data, getHeaders());

//API to fetch Patient Appointments of a specific Clinic.
export const getClinicAppointments = (clinicId, page, search, doctorId, startDate, endDate) =>
    axios.get(`/api/clinic/appointments/${clinicId}/${page}?search=${search}&doctorId=${doctorId}&startDate=${startDate}&endDate=${endDate}`, getHeaders());

//API to book a slot from a specific Clinic.
export const bookFromClinic = (data) =>
    axios.post("/api/clinic/bookFromClinic/slots", data, getHeaders());

//API to fetch Patient details
export const getPatients = (search) =>
    axios.get(`/api/clinic/patient/list?search=${search}`, getHeaders());

//API to update appointment status  
export const updateAppointmentStatus = (appointmentId, status, reason) =>
    axios.put(`/api/clinic/appointment/status/${appointmentId}`, { status, reason }, getHeaders());

//API to assign a token to a patient
export const assignPatientToken = (appointmentId, tokenNo) =>
    axios.post(`/api/clinic/appointmentToken/${appointmentId}`, { tokenNo }, getHeaders());

//API to fetch Analytics of a specific Clinic.
export const getAnalytics = (clinicId) =>
    axios.get(`/api/clinic/analytics/${clinicId}`, getHeaders());

//API to fetch the reports of a specific Clinic.
export const getReports = (clinicId, type) =>
    axios.get(`/api/clinic/reports/${clinicId}?type=${type}`, getHeaders());

