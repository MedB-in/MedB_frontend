import { useCallback, useEffect, useMemo, useState } from "react";
import { getAppointments } from "../../../services/patient";
import Button from "../../../components/Atoms/Login/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DoctorRemarksModal from "../../../components/Organs/Doctors/DoctorActionModal";
import AppointmentActions from "../../../components/Organs/Appointments/AppointmentActions";
import AppointmentCard from "../../../components/Atoms/Patient/AppointmentCard";
import Pagination from "../../../components/Atoms/Patient/Pagination";
import LoadingRow from "../../../components/Atoms/Patient/LoadingRow";
import AppointmentRow from "../../../components/Atoms/Patient/AppointmentsRow";

function PatientAppointmentsPage() {
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const doctor = userDetails?.doctorId ?? null;
  const isDoctor = !!doctor;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [clinicIdInitialized, setClinicIdInitialized] = useState(false);

  const cachedSearchQuery = sessionStorage.getItem("appointment_search_query") || "";
  const [searchQuery, setSearchQuery] = useState(cachedSearchQuery);

  const [selectedAppt, setSelectedAppt] = useState(() => {
    const cached = sessionStorage.getItem("selectedAppt");
    return cached ? JSON.parse(cached) : null;
  });

  const [selectedApptAction, setSelectedApptAction] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClinicChange = (e) => {
      const newClinicId = e.detail;
      setSelectedClinicId(newClinicId);
    };
    window.addEventListener('clinicIdChanged', handleClinicChange);
    return () => {
      window.removeEventListener('clinicIdChanged', handleClinicChange);
    };
  }, []);

  useEffect(() => {
    const storedClinicId = JSON.parse(localStorage.getItem("selectedClinicId"));
    if (storedClinicId) setSelectedClinicId(storedClinicId);
    setClinicIdInitialized(true);
  }, []);

  useEffect(() => {
    sessionStorage.setItem("appointment_search_query", searchQuery);
  }, [searchQuery]);

  const fetchData = async (force = false) => {
    const storageKey = `appointments_${doctor}_${currentPage}_${searchQuery}`;

    const cachedData = sessionStorage.getItem(storageKey);
    if (!force && cachedData) {
      setLoading(false);
      const parsed = JSON.parse(cachedData);
      setAppointments(parsed.appointments);
      setTotalPages(parsed.totalPages);
      setCurrentPage(parsed.currentPage);
    } else if (!cachedData) {
      setLoading(true);
    }
    try {
      const response = await getAppointments(doctor, currentPage, searchQuery, selectedClinicId);

      const result = {
        appointments: response.data.appointments.appointments,
        totalPages: response.data.appointments.totalPages,
        currentPage: response.data.appointments.currentPage,
      };

      setAppointments(result.appointments);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);

      sessionStorage.setItem(storageKey, JSON.stringify(result));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clinicIdInitialized) {
      fetchData();
    }
  }, [currentPage, searchQuery, selectedClinicId, clinicIdInitialized]);

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
    setLoading(true);
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenModal = (appt) => {
    setSelectedAppt(appt);
    sessionStorage.setItem("selectedAppt", JSON.stringify(appt));
  };

  const handleAppointmentModal = (appt) => {
    setSelectedApptAction(appt);
    setActionModalOpen(true);
  };
  const fetchAppointments = () => {
    fetchData();
  };

  const handleClose = useCallback(() => {
    setSelectedAppt(null);
    setSelectedApptAction(null);
    setActionModalOpen(false);
    fetchData();
  }, []);


  const handleHardClose = () => {
    setSelectedAppt(null);
    sessionStorage.removeItem("selectedAppt");
    setActionModalOpen(false);
  };

  return (
    <section className="p-4 flex flex-col items-center justify-center text-center min-h-[calc(100vh-80px)] md:mr-4 bg-[#f0f0ff] rounded-3xl">
      <div className="w-full max-w-md flex justify-between items-center">
        <input
          type="text"
          placeholder={isDoctor ? "Search by Patient name / Date" : "Search by Doctor name, clinic or date"}
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      {!isDoctor && (
        <Button variant="primary" className="w-[200px] sm:w-[300px]" onClick={() => navigate("/app/appointments/book-appointment")}>
          Book Appointment
        </Button>
      )}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 mt-6">
        <table className="hidden lg:table w-full table-auto border-collapse text-sm">
          <thead>
            <tr className="bg-[#e0e0ff] text-center">
              {!isDoctor ? <th className="px-4 py-3">Doctor</th> :
                <th className="px-4 py-3">Patient</th>}
              <th className="px-4 py-3">Appointment Date</th>
              <th className="px-4 py-3">Appointment Time</th>
              <th className="px-4 py-3">Clinic</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Reason</th>
              {!isDoctor && <th className="px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <LoadingRow key={index} index={index} isDoctor={isDoctor} />
                ))}
              </>
            ) : (
              <>
                {appointments.length ? (
                  appointments.map((appt, index) => (
                    <AppointmentRow
                      key={index}
                      appt={appt}
                      isDoctor={isDoctor}
                      handleOpenModal={handleOpenModal}
                      handleAppointmentModal={handleAppointmentModal}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-3 text-center rounded-lg">
                      No appointments found
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>

        {/*Cards for Small Screens */}
        <div className="lg:hidden space-y-4">
          {appointments.length ? (
            appointments.map((appt, index) => (
              <AppointmentCard
                key={index}
                appt={appt}
                isDoctor={isDoctor}
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
      {selectedAppt && (
        <DoctorRemarksModal appt={selectedAppt} onClose={handleClose} onCloseHard={handleHardClose} />
      )}

      {actionModalOpen && selectedApptAction && (
        <AppointmentActions appointment={selectedApptAction} onClose={handleClose} fetchAppointments={fetchAppointments} />
      )}
    </section>
  );
}

export default PatientAppointmentsPage;
