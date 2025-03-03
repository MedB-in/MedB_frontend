import React, { useEffect, useState } from "react";
import { getClinicAppointments } from "../../../services/clinics";
import { getActiveDoctorsList } from "../../../services/doctors";
import Button from "../../../components/Atoms/Login/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import AppointMentStatusModal from "../../../components/Organs/Clinics/AppointMentStatusModal";
import AssignTokenModal from "../../../components/Organs/Clinics/AssignTokenModal";

function AppointmentsManagement() {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const clinicId = userDetails?.clinicId;
    const today = format(new Date(), "yyyy-MM-dd");

    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [tokenModalOpen, setTokenModalOpen] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [filters, setFilters] = useState({
        query: "",
        doctorId: "",
        startDate: today,
        endDate: today
    });
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await getClinicAppointments(
                    clinicId,
                    currentPage,
                    filters.query,
                    filters.doctorId,
                    filters.startDate,
                    filters.endDate
                );
                setAppointments(response.data.appointments.appointments);
                setTotalPages(response.data.appointments.totalPages);
                setCurrentPage(response.data.appointments.currentPage);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch appointments.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [currentPage, filters]);

    useEffect(() => {
        async function fetchDoctors() {
            try {
                const response = await getActiveDoctorsList(clinicId);
                setDoctors(response.data.doctors);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch doctors.");
            }
        }
        fetchDoctors();
    }, []);

    const generatePagination = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, "...", totalPages];
        } else if (currentPage >= totalPages - 3) {
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const applyFilters = () => {
        if (new Date(startDate) > new Date(endDate)) {
            toast.error("Start date cannot be after end date.");
            return;
        }
        setFilters({
            query: searchQuery,
            doctorId: selectedDoctor,
            startDate: startDate,
            endDate: endDate
        });
        setCurrentPage(1);
    };

    useEffect(() => {
        setStartDate(today);
        setEndDate(today);

        setFilters(prev => ({
            ...prev,
            startDate: today,
            endDate: today
        }));
    }, []);

    const resetFilters = () => {
        setSearchQuery("");
        setSelectedDoctor("");
        setStartDate(today);
        setEndDate(today);

        setFilters({
            query: "",
            doctorId: "",
            startDate: today,
            endDate: today
        });
        setCurrentPage(1);
    };

    const handleStatus = (appointment) => {
        setSelectedAppt(appointment);
        setStatusModalOpen(true);
    };

    const closeStatusModal = () => {
        setSelectedAppt(null);
        setStatusModalOpen(false);
    };

    const updateAppointment = (updatedAppointment) => {
        const updatedAppointments = appointments.map(appt => {
            if (appt.appointmentId === updatedAppointment.appointmentId) {
                return updatedAppointment;
            }
            return appt;
        });
        setAppointments(updatedAppointments);
    };

    const handleToken = (appointment) => {
        setSelectedAppt(appointment);
        setTokenModalOpen(true);
    };

    const closeTokenModal = () => {
        setSelectedAppt(null);
        setTokenModalOpen(false);
    };

    return (
        <section className="flex flex-col items-center justify-center text-center bg-white">
            <div className="w-full max-w-lg mt-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <input
                    type="text"
                    placeholder="Search by doctor, patient, or date..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-400"
                />
            </div>

            <div className="w-full max-w-lg mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                    <select
                        value={selectedDoctor}
                        onChange={handleDoctorChange}
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-400"
                    >
                        <option value="">All Doctors</option>
                        {doctors.map((doc) => (
                            <option key={doc.doctorId} value={doc.doctorId}>
                                {`Dr. ${doc.firstName} ${doc.middleName ? doc.middleName + ' ' : ''}${doc.lastName || ''}`}
                            </option>
                        ))}
                    </select>
                </div>

                <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-400"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-gray-400"
                />
            </div>

            <div className="flex gap-2 mt-4">
                <Button variant="primary" onClick={applyFilters}>Search</Button>
                <Button variant="secondary" onClick={resetFilters}>Reset</Button>
            </div>



            <Button variant="primary" className="mt-4" onClick={() => navigate(`/appointments/book-appointment/${clinicId}`)}>
                Walk-In Appointment
            </Button>
            <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6 mt-4">
                <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-100 text-center">
                            <th className="px-4 py-3 border border-gray-200">No.</th>
                            <th className="px-4 py-3 border border-gray-200">Doctor</th>
                            <th className="px-4 py-3 border border-gray-200">Appointment Date</th>
                            <th className="px-4 py-3 border border-gray-200">Appointment Time</th>
                            <th className="px-4 py-3 border border-gray-200">Patient</th>
                            <th className="px-4 py-3 border border-gray-200">Status</th>
                            <th className="px-4 py-3 border border-gray-200">Reason</th>
                            <th className="px-4 py-3 border border-gray-200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="px-4 py-6 border border-gray-200 text-center text-gray-600 text-lg">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            <>
                                {appointments.length ? (
                                    appointments.map((appt, index) => (
                                        <tr key={index} className="odd:bg-white even:bg-gray-50">
                                            <td className="px-4 py-3 border border-gray-200 text-center">{index + 1}</td>

                                            <td className="px-4 py-3 border border-gray-200">
                                                <div className="flex justify-center">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={appt.doctorProfilePicture}
                                                            alt={appt.doctorFirstName}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-lg font-semibold">
                                                                {appt.doctorFirstName} {appt.doctorMiddleName ? appt.doctorMiddleName : ""} {appt.doctorLastName ? appt.doctorLastName : ""}
                                                            </p>
                                                            <p className="text-sm text-gray-600">{appt.doctorGender}</p>
                                                            <p className="text-sm text-gray-600">{appt.speciality}</p>
                                                            <p className="text-sm text-gray-600">{appt.experience} years of experience</p>
                                                            <p className="text-sm text-gray-600">{appt.qualifications}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 border border-gray-200 text-center">{appt.appointmentDate}</td>
                                            <td className="px-4 py-3 border border-gray-200 text-center">{appt.appointmentTime}</td>
                                            <td className="px-4 py-3 border border-gray-200">
                                                <div className="flex justify-center">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={appt.patientProfilePicture}
                                                            alt={appt.patientFirstName}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-lg font-semibold">{appt.patientFirstName}{appt.patientMiddleName ? appt.patientMiddleName : ""} {appt.patientLastName ? appt.patientLastName : ""} </p>
                                                            <p className="text-sm text-gray-600">{appt.patientEmail}</p>
                                                            <p className="text-sm text-gray-600">{appt.patientContactNo}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                className={`px-4 py-3 border border-gray-200 font-semibold text-center ${appt.appointmentStatus === "Scheduled"
                                                    ? "text-blue-600"
                                                    : appt.appointmentStatus === "Completed"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {appt.appointmentStatus}
                                            </td>
                                            <td
                                                className={`px-4 py-3 border border-gray-200 text-center capitalize ${(appt.isEmergency && today === appt.appointmentDate.split('-').reverse().join('-')) ? "bg-red-500 text-white animate-pulse font-bold" : ""
                                                    }`}
                                            >
                                                {appt.reasonForVisit || "N/A"}<br />
                                                {appt.isEmergency && " (Emergency)"}
                                            </td>
                                            <td className="flex flex-col gap-2 p-2 items-center">
                                                <button
                                                    onClick={() => handleStatus(appt)}
                                                    className="px-4 py-2 bg-blue-500/80 backdrop-blur-md border border-blue-500 shadow-lg shadow-blue-500/20 hover:bg-blue-500/50 text-white rounded-lg transition-all duration-300"
                                                >
                                                    Update Status
                                                </button>
                                                <button
                                                    onClick={() => handleToken(appt)}
                                                    className="px-4 py-2 bg-red-500/80 backdrop-blur-md border border-red-500 shadow-lg shadow-red-500/20 hover:bg-red-500/50 text-white rounded-lg transition-all duration-300"
                                                >
                                                    Assign Token
                                                </button>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-3 border border-gray-200 text-center">
                                            No appointments found
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                </table>
                <div className="mt-6 flex justify-center items-center space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {generatePagination().map((page, index) => (
                        <button
                            key={index}
                            className={`${page === "..." ? "text-gray-400 cursor-default"
                                : page === currentPage
                                    ? "bg-gray-300 text-gray-800 font-bold"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"} px-4 py-2 rounded-lg`}
                            onClick={() => page !== "..." && setCurrentPage(page)}
                            disabled={page === "..."}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
            <AppointMentStatusModal
                isOpen={statusModalOpen}
                onClose={closeStatusModal}
                appointment={selectedAppt}
                updateAppointment={updateAppointment}
            />
            <AssignTokenModal
                isOpen={tokenModalOpen}
                onClose={closeTokenModal}
                appointment={selectedAppt}
                updateAppointment={updateAppointment}
            />
        </section>
    );
}

export default AppointmentsManagement;