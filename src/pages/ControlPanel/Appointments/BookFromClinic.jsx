import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getActiveClinics } from "../../../services/clinics";
import toast, { Toaster } from "react-hot-toast";

const BookFromClinic = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      setError(null);
      try {
        const clinicData = await getActiveClinics(currentPage, searchQuery);
        setClinics(clinicData.data.clinics || []);
        setTotalPages(clinicData.data.totalPages || 1);
      } catch (err) {
        setError("Failed to fetch clinics");
        toast.error("Failed to fetch clinics");
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

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

  const handleClinicSelect = (clinicId) => {
    navigate(`/book-appointment/${clinicId}`);
  };

  return (
    <section className="p-4">
      <Toaster />
      <h2 className="text-xl font-bold text-center mb-4">Select a Clinic</h2>
      <div className="mb-4 w-full max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search clinics..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      {loading && <p className="text-center">Loading clinics...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && clinics.length === 0 && !error && (
        <p className="text-center text-gray-500">No clinics available.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {clinics.map((clinic) => (
          <div
            key={clinic?.clinicId}
            className="bg-white shadow-lg rounded-lg overflow-hidden p-5 border hover:shadow-xl hover:bg-blue-200 transition cursor-pointer"
            onClick={() => handleClinicSelect(clinic?.clinicId)}
          >
            <div className="flex items-center gap-4">
              <img
                className="w-16 h-16 rounded-full object-cover"
                src={clinic?.clinicPicture}
                alt={clinic?.name}
              />
              <div>
                <h2 className="text-lg font-semibold">{clinic.name}</h2>sfgred
                <p className="text-gray-600">{clinic.city}, {clinic.country}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
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
            className={`${page === "..." ? "text-gray-400 cursor-default" : page === currentPage ? "bg-gray-300 text-gray-800 font-bold" : "bg-gray-100 hover:bg-gray-200 text-gray-700"} px-4 py-2 rounded-lg`}
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
    </section>
  );
};

export default BookFromClinic;
