import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getActiveClinics } from "../../../services/clinics";
import toast from "react-hot-toast";

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
    navigate(`/appointments/book-appointment/${clinicId}`);
  };

  return (
    <section className="p-4 flex flex-col items-center min-h-[calc(100vh-80px)] mb-[18px] bg-[#f0f0ff] rounded-3xl md:mr-4">
      <div className="flex flex-col w-full p-5">
        <div className="text-center text-white bg-[#7a5fd3] py-3 rounded-lg text-lg font-semibold">
          Clinics List
        </div>
      </div>
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Search clinics..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-[300px] h-[345px] border-2 border-[#d1c4e9] rounded-xl bg-gradient-to-b from-[#f3f4ff] to-[#e8f8f5] shadow-md p-6 text-center animate-pulse"
            >
              <div className="w-full h-[200px] bg-gray-300 rounded-lg"></div>
              <div className="w-3/4 h-5 bg-gray-400 rounded-md mt-4 mx-auto"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded-md mt-2 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : clinics.length === 0 && !error ? (
        <p className="text-center text-gray-500">No clinics available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-4">
          {clinics.map((clinic) => (
            <div
              key={clinic?.clinicId}
              className="w-[300px] h-[345px] border-2 border-[#d1c4e9] rounded-xl bg-gradient-to-b from-[#f3f4ff] to-[#e8f8f5] p-6 text-center relative shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleClinicSelect(clinic?.clinicId)}
            >
              <div className="w-full h-[200px] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={clinic?.clinicPicture || "https://atlas-content-cdn.pixelsquid.com/stock-images/hospital-3yL2QM6-600.jpg"}
                  alt={clinic?.name}
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mt-3 capitalize">{clinic.name}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {clinic.city ? `${clinic.city}, ` : ""}
                {clinic.district ? `${clinic.district}, ` : ""}
                {clinic.state ? `${clinic.state}, ` : ""}
                {clinic.country}
              </p>
            </div>
          ))}
        </div>
      )}
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
            className={`px-4 py-2 rounded-lg ${page === "..." ? "text-gray-400 cursor-default" :
              page === currentPage ? "bg-gray-300 text-gray-800 font-bold" :
                "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
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
