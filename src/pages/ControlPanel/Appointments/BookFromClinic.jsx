import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getClinic } from "../../../services/clinics";
import toast, { Toaster } from "react-hot-toast";

const BookAppointment = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true);
      setError(null);
      try {
        const clinicData = await getClinic();
        setClinics(clinicData.data.clinics || []);
      } catch (err) {
        setError("Failed to fetch clinics");
        toast.error("Failed to fetch clinics");
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  const handleClinicSelect = (clinicId) => {
    navigate(`/book-appointment/${clinicId}`);
  };

  return (
    <section className="p-4">
      <Toaster />
      <h2 className="text-xl font-bold text-center mb-4">Select a Clinic</h2>
      {loading && <p className="text-center">Loading clinics...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && clinics.length === 0 && !error && (
        <p className="text-center text-gray-500">No clinics available.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {!loading &&
          clinics.length > 0 &&
          clinics.map((clinic) => (
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
                  <h2 className="text-lg font-semibold">{clinic.name}</h2>
                  <p className="text-gray-600">{clinic.city}, {clinic.country}</p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default BookAppointment;
