import React, { useState, useEffect } from "react";
import { getClinic, addClinic, editClinic } from "../../../services/clinics";
import toast, { Toaster } from "react-hot-toast";
import ClinicModal from "../../../components/Organs/Clinics/ClinicModal";

const ClinicsPage = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [clinicData, setClinicData] = useState(null);

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

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleAddClinic = () => {
    setClinicData(null);
    setIsClinicModalOpen(true);
  };

  const handleEditClinic = (clinicId) => {
    const clinicToEdit = clinics.find((clinic) => clinic.clinicId === clinicId);
    setClinicData(clinicToEdit);
    setIsClinicModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (data?.clinicId) {
        await editClinic(data.clinicId, data);
      } else {
        await addClinic(data);
      }
      await fetchClinics();
      setIsClinicModalOpen(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <section className="p-4">
      <Toaster />
      <div className="overflow-x-auto">
        <div className="flex justify-center gap-5 items-center py-4 px-4">
          <button className="py-2 px-4 border rounded hover:bg-blue-500 hover:text-white" onClick={handleAddClinic}>
            Add Clinic
          </button>
        </div>
        {loading && <p className="text-center">Loading clinics...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <table className="min-w-full">
          <thead>
            <tr className="text-left">
              <th className="py-2 px-4">Clinic Picture</th>
              <th className="py-2 px-4">Clinic Name</th>
              <th className="py-2 px-4">Address</th>
              <th className="py-2 px-4">Contact</th>
              {/* <th className="py-2 px-4">Email</th> */}
              {/* <th className="py-2 px-4">Website</th> */}
              <th className="py-2 px-4">Clinic Time</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clinics.map((clinic) => (
              <tr key={clinic?.clinicId} className="border-y">
                <td className="py-2 px-4"><img className="w-6 h-6" src={clinic?.clinicPicture} alt={clinic?.name} /></td>
                <td className="py-2 px-4">{clinic.name}</td>
                <td className="py-2 px-4">
                  {clinic.address.split(",").map((part, index) => (
                    <div key={index}>{part.trim()}</div>
                  ))}
                  <div>{clinic.city}</div>
                  <div>{clinic.country}</div>
                  <div>{clinic.postalCode}</div>
                </td>

                <td className="py-2 px-4">{clinic.contact}</td>
                {/* <td className="py-2 px-4">{clinic.email}</td> */}
                {/* <td className="py-2 px-4">{clinic.website}</td> */}
                <td className="py-2 px-4">
                  {clinic?.openingHours && (
                    <div>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex justify-between">
                          <span className="font-medium">{day}:</span>
                          <span>{clinic.openingHours[day]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className={`py-2 px-4 ${clinic.isActive ? "text-green-600" : "text-red-600"}`}>
                  {clinic.isActive ? "Active" : "Inactive"}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleEditClinic(clinic?.clinicId)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clinic Modal */}
      <ClinicModal
        isOpen={isClinicModalOpen}
        closeModal={() => setIsClinicModalOpen(false)}
        clinicData={clinicData}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default ClinicsPage;
