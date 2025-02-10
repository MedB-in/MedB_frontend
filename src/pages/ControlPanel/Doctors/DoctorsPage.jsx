import React, { useState, useEffect } from "react";
import { getDoctors, addDoctor, editDoctor } from "../../../services/doctors";
import toast, { Toaster } from "react-hot-toast";
import DoctorModal from "../../../components/Organs/Doctors/DoctorModal";

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [doctorData, setDoctorData] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const doctorData = await getDoctors();
      setDoctors(doctorData.data?.data || []);
    } catch (err) {
      setError("Failed to fetch doctors");
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleAddDoctor = () => {
    setDoctorData(null);
    setIsDoctorModalOpen(true);
  };

  const handleEditDoctor = (doctorId) => {
    const doctorToEdit = doctors.find((doctor) => doctor.doctorId === doctorId);
    setDoctorData(doctorToEdit);
    setIsDoctorModalOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (data?.doctorId) {
        await editDoctor(data.doctorId, data);
      } else {
        await addDoctor(data);
      }
      await fetchDoctors();
      setIsDoctorModalOpen(false);
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
          <button className="py-2 px-4 border rounded hover:bg-blue-500 hover:text-white" onClick={handleAddDoctor}>
            Add Doctor
          </button>
        </div>
        {loading && <p className="text-center">Loading doctors...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <table className="min-w-full">
          <thead>
            <tr className="text-left">
              <th className="py-2 px-4">Profile</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Specialization</th>
              <th className="py-2 px-4">Contact</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr key={doctor?.doctorId} className="border-y">
                <td className="py-2 px-4"><img className="w-6 h-6" src={doctor?.profilePicture} alt={doctor?.firstName} /></td>
                <td className="py-2 px-4">{doctor.firstName} {doctor.middleName} {doctor.lastName}</td>
                <td className="py-2 px-4">{doctor.speciality}</td>
                <td className="py-2 px-4">{doctor.phone}</td>
                <td className={`py-2 px-4 ${doctor.isActive ? "text-green-600" : "text-red-600"}`}>
                  {doctor.isActive ? "Active" : "Inactive"}
                </td>
                <td className="py-2 px-4 flex gap-2">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleEditDoctor(doctor?.doctorId)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Doctor Modal */}
      <DoctorModal
        isOpen={isDoctorModalOpen}
        closeModal={() => {
          setIsDoctorModalOpen(false);
          setDoctorData(null);
        }}
        doctorData={doctorData}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default DoctorsPage;
