import { useEffect, useState, useCallback, useMemo } from "react";
import { getClinicAppointments } from "../../../services/clinics";
import { getActiveDoctorsList } from "../../../services/doctors";
import Button from "../../../components/Atoms/Login/Button";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import AppointMentStatusModal from "../../../components/Organs/Clinics/AppointMentStatusModal";
import AssignTokenModal from "../../../components/Organs/Clinics/AssignTokenModal";
import AppointmentTable from "../../../components/Organs/Appointments/AppointmentsTable";

function AppointmentsManagement() {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const clinicId = userDetails?.clinicId;
    const today = format(new Date(), "yyyy-MM-dd");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status");
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(status === "upcoming"
        ? format(new Date(new Date().setMonth(new Date().getMonth() + 3)), "yyyy-MM-dd")
        : today);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [tokenModalOpen, setTokenModalOpen] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [filters, setFilters] = useState({
        query: "",
        doctorId: "",
        startDate: today,
        endDate: status === "upcoming"
            ? format(new Date(new Date().setMonth(new Date().getMonth() + 3)), "yyyy-MM-dd")
            : today
    });
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
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
    }, [clinicId, currentPage, filters]);

    const fetchDoctors = useCallback(async () => {
        try {
            const response = await getActiveDoctorsList(clinicId);
            setDoctors(response.data.doctors);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch doctors.");
        }
    }, [clinicId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const generatePagination = useMemo(() => {
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
    }, [totalPages, currentPage]);

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

    // useEffect(() => {
    //     setStartDate(today);
    //     setEndDate(today);

    //     setFilters(prev => ({
    //         ...prev,
    //         startDate: today,
    //         endDate: today
    //     }));
    // }, []);

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

    const setNewAppointment = () => {
        fetchData()
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
        <section className="p-4 flex flex-col items-center min-h-[calc(100vh-80px)] mt-2 bg-[#e8e8ff] rounded-3xl">
            <div className="w-full mt-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white/20 backdrop-blur-md p-4 rounded-xl shadow-lg">
                <div className="w-full sm:flex-1 flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-auto md:w-[300px]">
                        <input
                            type="text"
                            placeholder="Search by doctor, patient, or date..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-gray-500 focus:border-gray-600 placeholder-gray-600 text-gray-800"
                        />
                    </div>
                    <div className="relative w-full sm:w-auto md:w-[300px]">
                        <select
                            value={selectedDoctor}
                            onChange={handleDoctorChange}
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-md bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800 appearance-none"
                        >
                            <option value="">All Doctors</option>
                            {doctors.map((doc) => (
                                <option key={doc.doctorId} value={doc.doctorId}>
                                    {`Dr. ${doc.firstName} ${doc.middleName ? doc.middleName + ' ' : ''}${doc.lastName || ''}`}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute right-3 top-4 -translate-y-1/2 text-gray-600">
                            ⌄
                        </div>
                    </div>
                    <div className="w-full sm:flex-1 flex items-center gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-md bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800"
                        />
                        <span className="text-gray-600">To</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-md bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800"
                        />
                    </div>
                </div>
            </div>
            <Button variant="primary" className="lg:hidden" onClick={applyFilters}>Search</Button>
            <Button variant="secondary" className="lg:hidden" onClick={resetFilters}>Reset</Button>
            <div className="hidden lg:flex gap-2 mt-4">
                <Button variant="primary" onClick={applyFilters}>Search</Button>
                <Button variant="secondary" onClick={resetFilters}>Reset</Button>
            </div>
            <Button variant="primary" className="" onClick={() => navigate(`/appointments/book-appointment/${clinicId}`)}>
                Walk-In Appointment
            </Button>
            <div className="w-full overflow-x-auto rounded-lg border border-gray-200 mt-6">
                <AppointmentTable
                    appointments={appointments}
                    loading={loading}
                    handleStatus={handleStatus}
                    handleToken={handleToken}
                    today={today}
                />
            </div>
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-2">
                    <button
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {generatePagination.map((page, index) => (
                        <button
                            key={index}
                            className={`${page === "..." ? "text-gray-400 cursor-default"
                                : page === currentPage
                                    ? "bg-gray-300 text-gray-800 font-bold"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"} px-4 py-2 rounded-lg`}
                            onClick={() => page !== "..." && setCurrentPage(page)}
                            disabled={page === "..."}>
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
            )}
            <AppointMentStatusModal
                isOpen={statusModalOpen}
                onClose={closeStatusModal}
                appointment={selectedAppt}
                clinicId={clinicId}
                updateAppointment={updateAppointment}
                setAppointment={setNewAppointment}
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