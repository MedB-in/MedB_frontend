import React, { useEffect, useState } from "react";
import { getAppointments } from "../../../services/patient";
import Button from "../../../components/Atoms/Login/Button";
import { useNavigate } from "react-router-dom";

function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAppointments(currentPage, searchQuery);
        setAppointments(response.data.appointments.appointments);
        setTotalPages(response.data.appointments.totalPages);
        setCurrentPage(response.data.appointments.currentPage);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, searchQuery]);

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
    setLoading(true);
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <section className="flex flex-col items-center justify-center text-center bg-white">
      <div className="mb-4 w-full max-w-md mt-5 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      <Button variant="primary" onClick={() => navigate("/appointments/book-appointment")}>
      Book Appointment
    </Button>
      <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6">
        <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="px-4 py-3 border border-gray-200">Doctor</th>
              <th className="px-4 py-3 border border-gray-200">Appointment Date</th>
              <th className="px-4 py-3 border border-gray-200">Appointment Time</th>
              <th className="px-4 py-3 border border-gray-200">Clinic</th>
              <th className="px-4 py-3 border border-gray-200">Status</th>
              <th className="px-4 py-3 border border-gray-200">Reason</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 border border-gray-200 text-center text-gray-600 text-lg">
                  Loading...
                </td>
              </tr>
            ) : (
              <>
                {appointments.length ? (
                  appointments.map((appt, index) => (
                    <tr key={index} className="odd:bg-white even:bg-gray-50">
                      <td className="px-4 py-3 border border-gray-200">
                        <div className="flex justify-center">
                          <div className="flex items-center gap-4">
                            <img
                              src={appt.profilePicture}
                              alt={appt.firstName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <p className="text-lg font-semibold">
                                {appt.firstName} {appt.middleName ? appt.middleName : ""} {appt.lastName ? appt.lastName : ""}
                              </p>
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
                        <div className="flex items-center gap-4 justify-center">
                          <img
                            src={appt.clinicPicture}
                            alt={appt.clinicName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <p className="text-lg font-semibold">{appt.clinicName}</p>
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
                      <td className="px-4 py-3 border border-gray-200 text-center capitalize">
                        {appt.reasonForVisit || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 border border-gray-200 text-center">
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
    </section>
  );
}

export default PatientAppointmentsPage;
