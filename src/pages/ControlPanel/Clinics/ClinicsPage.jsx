import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { getAllClinics, addClinic, editClinic } from "../../../services/clinics";
import toast, { Toaster } from "react-hot-toast";
import ClinicModal from "../../../components/Organs/Clinics/ClinicModal";
import Button from "../../../components/Atoms/Login/Button";
import Pagination from "../../../components/Atoms/Patient/Pagination";

const ClinicsPage = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [clinicData, setClinicData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchClinics = async () => {
    setLoading(true);
    setError(null);
    try {
      const clinicData = await getAllClinics(currentPage, searchQuery);
      setClinics(clinicData?.data.clinics.clinics || []);
      setTotalPages(clinicData?.data.clinics.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch clinics");
      toast.error("Failed to fetch clinics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClinics();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage]);

  const handleAddClinic = () => {
    setClinicData(null);
    setIsClinicModalOpen(true);
  };

  const handleEditClinic = (event, clinicId) => {
    event.stopPropagation();
    const clinicToEdit = clinics.find((clinic) => clinic.clinicId === clinicId);
    setClinicData(clinicToEdit);
    setIsClinicModalOpen(true);
  };

  const handleCardClick = (clinicId) => {
    navigate(`/app/clinics/${clinicId}`);
  };

  const handleSubmit = async (data, clinicId) => {
    try {
      if (clinicId) {
        const response = await editClinic(clinicId, data);
        const editedClinic = response.data.data

        setClinics(prevClinics =>
          prevClinics.map(clinic =>
            clinic.clinicId === clinicId ? { ...clinic, ...editedClinic } : clinic
          )
        );

        setIsClinicModalOpen(false);
        toast.success(response.data.message);
      } else {
        const response = await addClinic(data);
        const newClinic = response.data.data

        setClinics(prevClinics => [...prevClinics, newClinic]);

        setIsClinicModalOpen(false);
        toast.success(response.data.message);
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const handleSearch = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleCloseModal = () => {
    setIsClinicModalOpen(false);
    setClinicData(null);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

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

  return (
    <section className="p-4">
      <Toaster />
      <div className="flex flex-col items-center py-4">
        <div className="flex justify-center gap-5 items-center">
          <Button onClick={handleAddClinic}>Add Clinic</Button>
          <Button
            onClick={() => navigate("clinic-registrations")}
            variant="secondary"
          >
            Clinic Registrations
          </Button>
        </div>

        <div className="mt-5 w-full max-w-md">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>
      {loading && <p className="text-center">Loading clinics...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && clinics.length === 0 && !error && (
        <p className="text-center text-gray-500">No clinics available. Click "Add Clinic" to create one.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {!loading &&
          clinics.length > 0 &&
          clinics.map((clinic, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden p-5 border hover:shadow-xl hover:bg-blue-200 transition cursor-pointer"
              onClick={() => handleCardClick(clinic?.clinicId)}
            >
              <div className="flex items-center gap-4">
                {clinic?.clinicPicture ? (
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src={clinic.clinicPicture}
                    alt={clinic.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-sm text-white">
                    N/A
                  </div>
                )} <div>
                  <h2 className="text-lg font-semibold">{clinic.name}</h2>
                  <p className="text-gray-600">{clinic.city}, {clinic.country}</p>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <p><strong>Address:</strong> {clinic.address}, {clinic.city}, {clinic.country}, {clinic.postalCode}</p>
                <p><strong>Contact:</strong> {clinic.contact}</p>
              </div>

              {clinic?.openingHours && (
                <div className="mt-3">
                  <p className="font-medium">Clinic Hours:</p>
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="font-medium">{day}:</span>
                      <span>{clinic.openingHours[day] || "Closed"}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${clinic.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {clinic.isActive ? "Active" : "Inactive"}
                </span>
                <button
                  className="px-3 py-2 bg-indigo-500 text-white text-sm rounded-md hover:bg-blue-600 transition"
                  onClick={(event) => handleEditClinic(event, clinic?.clinicId)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          generatePagination={generatePagination}
          setCurrentPage={setCurrentPage}
          handlePrev={handlePrev}
          handleNext={handleNext}
        />
      )}
      {/* Clinic Modal */}
      {isClinicModalOpen && (
        <ClinicModal
          isOpen={isClinicModalOpen}
          closeModal={handleCloseModal}
          clinicData={clinicData}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
};

export default ClinicsPage;
