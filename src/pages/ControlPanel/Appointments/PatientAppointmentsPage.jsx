import { useCallback, useEffect, useMemo, useState } from "react";
import { getFilteredAppointments, getDoctorClinicList } from "../../../services/patient";
import Button from "../../../components/Atoms/Login/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DoctorRemarksModal from "../../../components/Organs/Doctors/DoctorActionModal";
import AppointmentActions from "../../../components/Organs/Appointments/AppointmentActions";
import AppointmentCard from "../../../components/Atoms/Patient/AppointmentCard";
import Pagination from "../../../components/Atoms/Patient/Pagination";
import LoadingRow from "../../../components/Atoms/Patient/LoadingRow";
import AppointmentRow from "../../../components/Atoms/Patient/AppointmentsRow";
import { getISTDate } from "../../../utils/time";
import { format } from "date-fns";

function PatientAppointmentsPage() {
  const today = getISTDate();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("Scheduled");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [startDate, setStartDate] = useState(selectedStatus === "Scheduled" && today);
  const [endDate, setEndDate] = useState(selectedStatus === "Scheduled" && format(new Date(new Date().setMonth(new Date().getMonth() + 3)), "yyyy-MM-dd"));
  const [selectedClinic, setSelectedClinic] = useState("");

  const [filters, setFilters] = useState({
    doctorId: "",
    clinicId: "",
    startDate: today,
    endDate: today,
    status: "Scheduled",
  });

  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);

  const [selectedAppt, setSelectedAppt] = useState(null);
  const [selectedApptAction, setSelectedApptAction] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);

  const fetchDoctorClinicList = async () => {
    try {
      const res = await getDoctorClinicList();
      setDoctors(res.data.doctors || []);
      setClinics(res.data.clinics || []);
    } catch (error) {
      toast.error("Failed to fetch doctors and clinics.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getFilteredAppointments({
        page: currentPage || 1,
        doctorId: filters.doctorId,
        clinicId: filters.clinicId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status,
      });

      setAppointments(response.data.appointments || []);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorClinicList();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters, currentPage]);

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

  const handleDoctorChange = (e) => {
    const value = e.target.value;
    setSelectedDoctor(value);
    setSelectedClinic("");
  };

  const handleClinicChange = (e) => {
    const value = e.target.value;
    setSelectedClinic(value);
    setSelectedDoctor("");
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);

    if (status === "Scheduled") {
      setStartDate(today);
      setEndDate(format(new Date(new Date().setMonth(new Date().getMonth() + 3)), "yyyy-MM-dd"));
    } else if (status === "Completed" || status === "Expired") {
      setStartDate(format(new Date(new Date().setMonth(new Date().getMonth() - 3)), "yyyy-MM-dd"));
      setEndDate(today);
    }
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
      doctorId: selectedDoctor,
      clinicId: selectedClinic,
      startDate,
      endDate,
      status: selectedStatus
    });

    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedDoctor("");
    setSelectedClinic("");
    setSelectedStatus("Scheduled");
    setStartDate(today);
    setEndDate(format(new Date(new Date().setMonth(new Date().getMonth() + 3)), "yyyy-MM-dd"));

    setFilters({
      doctorId: "",
      clinicId: "",
      startDate: today,
      endDate: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), "yyyy-MM-dd"),
      status: "Scheduled"
    });

    setCurrentPage(1);
  };

  const handleOpenModal = (appt) => setSelectedAppt(appt);

  const handleAppointmentModal = (appt) => {
    setSelectedApptAction(appt);
    setActionModalOpen(true);
  };

  const handleClose = useCallback(() => {
    setSelectedAppt(null);
    setSelectedApptAction(null);
    setActionModalOpen(false);
    fetchData();
  }, []);

  const handleHardClose = () => {
    setSelectedAppt(null);
    setActionModalOpen(false);
  };

  return (
    <section className="p-4 flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] mt-5 md:mt-0 md:mr-4 bg-[#f0f0ff] rounded-3xl">
      <Button variant="primary" className="w-[200px] sm:w-[300px]" onClick={() => navigate("/app/appointments/book-appointment")}>
        Book Appointment
      </Button>
      <div className="w-full overflow-x-auto mt-6">
        <div className="w-full p-4 rounded-xl border border-gray-200 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-wrap lg:flex-row justify-center">
            <div className="relative w-full sm:w-[250px]">
              <label className="text-sm text-gray-700 font-medium mb-1 block">Doctor</label>
              <select
                value={selectedDoctor}
                onChange={handleDoctorChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-md bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800 appearance-none"
              >
                <option value="">All Doctors</option>
                {doctors.map(doc => (
                  <option key={doc.doctorId} value={doc.doctorId}>
                    Dr. {doc.fullName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-[55%] -translate-y-1/2 text-gray-600">⌄</div>
            </div>

            <div className="relative w-full sm:w-[250px]">
              <label className="text-sm text-gray-700 font-medium mb-1 block">Clinic</label>
              <select
                value={selectedClinic}
                onChange={handleClinicChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-md bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800 appearance-none"
              >
                <option value="">All Clinics</option>
                {clinics.map(clinic => (
                  <option key={clinic.clinicId} value={clinic.clinicId}>
                    {clinic.clinicName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-[55%] -translate-y-1/2 text-gray-600">⌄</div>
            </div>

            <div className="relative w-full sm:w-[250px]">
              <label className="text-sm text-gray-700 font-medium mb-1 block">Status</label>
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-md bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800 appearance-none"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Expired">Expired</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-[55%] -translate-y-1/2 text-gray-600">⌄</div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-2 w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <label className="text-sm text-gray-700 font-medium mb-1 block">From</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800"
                />
              </div>
              <div className="w-full sm:w-auto">
                <label className="text-sm text-gray-700 font-medium mb-1 block">To</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-md bg-white/30 backdrop-blur-md focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-gray-800"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 justify-center lg:justify-center">
            <Button variant="primary" onClick={applyFilters} disabled={loading}>Search</Button>
            <Button variant="secondary" onClick={resetFilters}>Reset</Button>
          </div>
        </div>

        <table className="hidden lg:table w-full table-auto border-collapse mt-5 text-sm">
          <thead>
            <tr className="bg-[#e0e0ff] text-center">
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Appointment Date</th>
              <th className="px-4 py-3">Appointment Time</th>
              <th className="px-4 py-3">Clinic</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <LoadingRow key={index} index={index} isDoctor={false} />
                ))}
              </>
            ) : (
              <>
                {appointments.length ? (
                  appointments.map((appt, index) => (
                    <AppointmentRow
                      key={index}
                      appt={appt}
                      isDoctor={false}
                      today={today}
                      handleOpenModal={handleOpenModal}
                      handleAppointmentModal={handleAppointmentModal}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-3 text-center rounded-lg">
                      No appointments found
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>

        <div className="lg:hidden space-y-4 mt-5">
          {appointments.length ? (
            appointments.map((appt, index) => (
              <AppointmentCard
                key={index}
                appt={appt}
                today={today}
                isDoctor={false}
                page={currentPage}
                handleOpenModal={handleOpenModal}
                handleAppointmentModal={handleAppointmentModal}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No appointments found</p>
          )}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            generatePagination={generatePagination}
          />
        )}
      </div>
      {actionModalOpen && selectedApptAction && (
        <AppointmentActions appointment={selectedApptAction} onClose={handleClose} fetchAppointments={fetchData} />
      )}
    </section>
  );
}

export default PatientAppointmentsPage;
