import { useState, useEffect } from "react";
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

  const handleSubmit = async (data, doctorId) => {
    try {
      if (doctorId) {
        const response = await editDoctor(doctorId, data);
        toast.success(response.data.message);
      } else {
        const response = await addDoctor(data);
        toast.success(response.data.message);
      }
      await fetchDoctors();
      setIsDoctorModalOpen(false);
    } catch (error) {
      toast.error("Error in handleSubmit:", error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <section className="p-4">
      <Toaster />
      <div className="flex justify-center gap-5 items-center py-4 px-4">
        <button
          className="py-2 px-4 border rounded hover:bg-blue-500 hover:text-white"
          onClick={handleAddDoctor}
        >
          Add Doctor
        </button>
      </div>

      {loading ? (
        <p className="text-center py-4">Loading doctors...</p>
      ) : error === !null ? (
        <p className="text-center py-4">{error}</p>)
        : doctors.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No doctors found. Click "Add Doctor" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {doctors.map((doctor) => (
              <div
                key={doctor?.doctorId}
                className="bg-white shadow-lg rounded-lg overflow-hidden p-5 border hover:shadow-xl transition flex flex-col h-full"
              >
                <div className="flex items-center gap-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    src={doctor?.profilePicture || "/default-avatar.png"}
                    alt={doctor?.doctorName}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                    <p className="text-gray-500 text-sm">{doctor.qualifications}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-gray-700 text-sm flex-grow">
                  <p className="font-medium">Reg No:</p> <p>{doctor.registration}</p>
                  <p className="font-medium">Experience:</p> <p>{doctor.experience} years</p>
                  <p className="font-medium">Gender:</p> <p>{doctor.gender}</p>
                  <p className="font-medium">Contact No:</p> <p>{doctor.phone}</p>
                  <p className="font-medium">Email:</p> <p>{doctor.email}</p>
                  <p className="font-medium">Address:</p>
                  <p className="text-gray-600 mb-5">
                    {doctor.address}, {doctor.district}, {doctor.state}, {doctor.country} - {doctor.postalCode}
                  </p>
                </div>
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-200">
                  <div>
                    <p className={`font-semibold ${doctor.isActive ? "text-green-600" : "text-red-600"}`}>
                      {doctor.isActive ? "Active" : "Inactive"}
                    </p>
                    <p className={`font-semibold ${doctor.isVerified ? "text-blue-600" : "text-red-600"}`}>
                      {doctor.isVerified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => handleEditDoctor(doctor?.doctorId)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      {/* Doctor Modal */}
      {isDoctorModalOpen && (
        <DoctorModal
          isOpen={isDoctorModalOpen}
          closeModal={() => {
            setIsDoctorModalOpen(false);
            setDoctorData(null);
          }}
          doctorData={doctorData}
          clinicId={null}
          fromClinic={false}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
};

export default DoctorsPage;
