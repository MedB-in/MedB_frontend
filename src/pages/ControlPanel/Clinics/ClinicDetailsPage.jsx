import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getClinic } from "../../../services/clinics";
import DoctorModal from "../../../components/Organs/Clinics/DoctorToClinicModal";
import toast from "react-hot-toast";

const ClinicDetailsPage = () => {
    const { clinicId } = useParams();
    const navigate = useNavigate();
    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        const fetchClinicDetails = async () => {
            try {
                const data = await getClinic(clinicId);
                setClinic(data.data.data);
                setDoctors(data.data.data.doctors || []);
            } catch (error) {
                toast.error("Failed to fetch clinic details.");
            }
        };
        fetchClinicDetails();
    }, [clinicId]);

    const openModal = (doctor = null) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 space-y-6">
            <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={() => navigate('/clinics')}
            >
                ← Back
            </button>
            {/* Clinic Details Section */}
            {clinic && (
                <div className="bg-white shadow-lg p-6 rounded-lg w-full flex flex-col md:flex-row items-center md:items-start gap-6">
                    <img
                        loading="lazy"
                        src={clinic.clinicPicture}
                        alt={clinic.clinicName}
                        className="w-full md:w-1/3 h-48 md:h-56 object-contain rounded-lg"
                    />
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold">{clinic.clinicName}</h2>
                        <p className="text-gray-600">{clinic.address}</p>
                        <p className="text-gray-500">
                            {clinic.city}, {clinic.state}, {clinic.country} - {clinic.postalCode}
                        </p>
                        <p className="text-gray-500">📞 {clinic.contact}</p>
                        <p className="text-gray-500">✉️ {clinic.email}</p>
                        {clinic.website && (
                            <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                🌐 {clinic.website}
                            </a>
                        )}
                    </div>
                </div>

            )}

            {/* Add Doctor Button */}
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => openModal()}
            >
                Add Doctor
            </button>

            {/* Doctors List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <div
                        key={doctor.doctorId}
                        className="p-6 border border-gray-200 rounded-lg shadow-md bg-white hover:shadow-lg transition duration-200"
                    >
                        {/* Doctor Image & Name */}
                        <div className="flex items-center gap-4">
                            <img
                                src={doctor.profilePicture || "/default-doctor.png"} // Fallback image need to change
                                alt={doctor.doctorName}
                                className="w-16 h-16 rounded-full object-cover border"
                            />
                            <div>
                                <h3 className="text-xl font-semibold">{doctor.doctorName}</h3>
                                <p className="text-sm text-gray-500">{doctor.speciality}</p>
                            </div>
                        </div>

                        {/* Qualifications */}
                        <p className="text-gray-600 mt-2">{doctor.qualifications}</p>

                        {/* Status Indicators */}
                        <div className="flex items-center gap-2 mt-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.isActiveDoctor ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {doctor.isActiveDoctor ? "Doctor Available" : "Doctor Not Available"}
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.isActiveDoctorClinic ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {doctor.isActiveDoctorClinic ? "Consulatation Available" : "Consulatation Not Available"}
                            </span>
                        </div>

                        {/* Experience, Contact Info */}
                        <div className="mt-4 text-sm text-gray-600 space-y-1">
                            <p>📅 <span className="font-medium">Experience:</span> {doctor.experience} years</p>
                            <p>📞 <span className="font-medium">Phone:</span> {doctor.phone}</p>
                            <p>✉️ <span className="font-medium">Email:</span> {doctor.email}</p>
                        </div>

                        {/* Slots */}
                        {doctor.slots.length > 0 ? (
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold">🕒 Available Slots:</h4>
                                <ul className="text-gray-600 text-sm mt-1 space-y-1">
                                    {doctor.slots.map((slot) => (
                                        <li key={slot.slotId} className="bg-gray-100 px-2 py-1 rounded-md text-xs">
                                            {slot.timingFrom} - {slot.timingTo} ({slot.slotGap} min gap)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm mt-4">No slots available</p>
                        )}

                        {/* Edit Button */}
                        <button
                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                            onClick={() => openModal(doctor)}
                        >
                            Edit Slots
                        </button>
                    </div>
                ))}
            </div>


            {/* Doctor Modal */}
            {isModalOpen && (
                <DoctorModal
                    isOpen={isModalOpen}
                    closeModal={() => setIsModalOpen(false)}
                    doctorData={selectedDoctor}
                />
            )}
        </div>
    );
};

export default ClinicDetailsPage;
