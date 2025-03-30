import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import ClinicModal from "../../../components/Organs/Clinics/ClinicModal";
import DoctorToClinicModal from "../../../components/Organs/Clinics/DoctorToClinicModal";
import DoctorModal from "../../../components/Organs/Doctors/DoctorModal";
import days from "../../../lib/slotDays";
import { editClinic, getClinicById, setIsDoctorClinicStatus } from "../../../services/clinics";
import { addDoctor, editDoctor } from "../../../services/doctors";
import DefaultImage from "../../../assets/images/default-doctor.png";


const ClinicDetailsPage = ({ idClinic }) => {
    let { clinicId } = useParams();
    if (idClinic)
        clinicId = idClinic
    const navigate = useNavigate();
    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
    const [isDoctorToClinicModalOpen, setIsDoctorToClinicModalOpen] = useState(false);
    const [clinicData, setClinicData] = useState(null);
    const [selectedDays, setSelectedDays] = useState({});

    const fetchClinicDetails = async () => {
        try {
            const data = await getClinicById(clinicId);
            setClinic(data.data.data);
            setDoctors(data.data.data.doctors || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch clinic details.");
        }
    };

    useEffect(() => {
        fetchClinicDetails();
    }, [clinicId]);

    const openModal = (doctor = null) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const handleEditDoctor = (doctorId) => {
        const doctorToEdit = doctors.find((doctor) => doctor.doctorId === doctorId);
        if (!doctorToEdit) return;
        const updatedDoctor = {
            ...doctorToEdit,
            isActive: doctorToEdit.isActiveDoctor,
        };
        setSelectedDoctor(updatedDoctor);
        setIsModalOpen(true);
    };

    const handleEditClinic = (clinic) => {
        setClinicData(clinic);
        setIsClinicModalOpen(true);
    };

    const handleSlots = (clinicId, doctorId) => {
        navigate(`/clinics/slots/${clinicId}/${doctorId}`);
    };

    const handleSubmit = async (data) => {
        try {
            if (data?.doctorId) {
                const response = await editDoctor(data.doctorId, data);
                toast.success(response.data.message);
            } else {
                const response = await addDoctor(data);
                toast.success(response.data.message);
            }
            await fetchClinicDetails();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };


    const handleClinicEditSubmit = async (data) => {
        try {
            const response = await editClinic(data.clinicId, data);
            toast.success(response.data.message);
            await fetchClinicDetails();
            setIsClinicModalOpen(false);
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
        }
    };

    const handleAddDoctorToClinic = async () => {
        setIsDoctorToClinicModalOpen(true);
    };

    const handleClinicUsers = () => {
        navigate(`/clinics/users/${clinicId}`);
    };

    const toggleSelectedDay = (doctorId, dayId) => {
        setSelectedDays((prev) => ({
            ...prev,
            [doctorId]: prev[doctorId] === dayId ? undefined : dayId,
        }));
    };

    const handleDoctorClinicStatus = async (doctorId, isChecked) => {
        const result = await Swal.fire({
            title: "Consultation Status",
            text: `Are you sure you want to ${isChecked ? "activate" : "deactivate"}consultation for this doctor?`,
            showCancelButton: true,
            confirmButtonColor: "#6F64E7",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Confirm!",
        });

        if (!result.isConfirmed) return;

        try {
            const response = await setIsDoctorClinicStatus(doctorId, clinicId, isChecked);
            setDoctors((prevDoctors) =>
                prevDoctors.map((doctor) =>
                    doctor.doctorId === doctorId
                        ? { ...doctor, isActiveDoctorClinic: isChecked }
                        : doctor
                )
            );
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };


    return (
        <div className="p-4">
            <button
                className="bg-gray-200 text-gray-700 px-4 py-2 my-5 rounded-md hover:bg-gray-300"
                onClick={() => window.history.back()}
            >
                ← Back
            </button>
            {clinic && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl p-6 rounded-2xl w-full flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-200">
                    <img
                        loading="lazy"
                        src={clinic.clinicPicture}
                        alt={clinic.name}
                        className="w-full md:w-1/3 h-48 md:h-56 object-contain rounded-lg shadow-md border border-gray-300"
                    />
                    <div className="flex-1 space-y-3">
                        <h2 className="text-3xl font-bold text-gray-800">{clinic.name}</h2>
                        <p className="text-gray-600 text-lg">{clinic.address}</p>
                        <p className="text-gray-500 text-md">
                            📍 {clinic.city}, {clinic.state}, {clinic.country} - {clinic.postalCode}
                        </p>
                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">📞</span>
                            <p className="text-md">{clinic.contact}</p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">✉️</span>
                            <p className="text-md">{clinic.email}</p>
                        </div>
                        {clinic.website && (
                            <a
                                href={clinic.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 transition font-medium flex items-center gap-1"
                            >
                                🌐 Visit Website
                            </a>
                        )}
                    </div>
                    <button
                        className="text-gray-500 hover:text-gray-700 transition"
                        onClick={() => handleEditClinic(clinic)}
                        title="Edit Clinic"
                    >
                        <Pencil size={25} />
                    </button>
                </div>
            )}

            {!idClinic && (
                <>
                    <button
                        title="Add New Doctor"
                        className="bg-blue-500 my-5 mr-5 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        onClick={() => handleClinicUsers()}
                    >Manage Clinic Users
                    </button>
                    <button
                        title="Add New Doctor"
                        className="bg-blue-500 my-5 mr-5 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        onClick={() => openModal()}
                    >
                        Add New Doctor
                    </button>
                    <button
                        title="Add a Doctor from a List of Doctors"
                        className="bg-blue-500 my-5  text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        onClick={handleAddDoctorToClinic}
                    >
                        Add Doctor From List
                    </button>
                </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                {doctors.map((doctor) => (
                    <div
                        key={doctor.doctorId}
                        className="p-6 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition duration-200 flex flex-col"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src={doctor.profilePicture || DefaultImage}
                                    alt={doctor.doctorName}
                                    className="w-16 h-16 rounded-full object-cover border"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500">{doctor.speciality}</p>
                                    <p className="text-gray-600">{doctor.qualifications}</p>
                                </div>
                            </div>
                            {!idClinic && (
                                <>
                                    <button
                                        className="text-gray-500 hover:text-gray-700 transition"
                                        onClick={() => handleEditDoctor(doctor.doctorId)}
                                        title="Edit Doctor"
                                    >
                                        <Pencil size={25} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex gap-2 mt-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.isActiveDoctor ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {doctor.isActiveDoctor ? "Doctor Available" : "Doctor Not Available"}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.isActiveDoctorClinic ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {doctor.isActiveDoctorClinic ? "Consultation Available" : "Consultation Not Available"}
                            </span>
                        </div>

                        <div className="mt-4 text-sm text-gray-600 space-y-2 flex-grow">
                            <p>👤 <span className="font-medium">Gender:</span> {doctor.gender}</p>
                            <p>⏳ <span className="font-medium">Experience:</span> {doctor.experience} years</p>
                            <p>📞 <span className="font-medium">Phone:</span> {doctor.phone}</p>
                            <p>✉️ <span className="font-medium">Email:</span> {doctor.email}</p>
                            <p>📝 <span className="font-medium">Registration:</span> {doctor.registration}</p>

                            <div className="mt-4">
                                <h4 className="text-md font-semibold">🕒 Available Slots:</h4>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {days.map((day) => {
                                        const hasSlots = doctor.slots.some((slot) => slot.day === day.id);
                                        return (
                                            <button
                                                key={day.id}
                                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all hover:scale-105 ${hasSlots ? "text-green-500" : "text-red-500"} ${selectedDays[doctor.doctorId] === day.id ? "scale-105 bg-slate-200 shadow-lg" : ""}`}
                                                title="Select Day"
                                                onClick={() => toggleSelectedDay(doctor.doctorId, day.id)}
                                            >
                                                {day.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedDays[doctor.doctorId] !== undefined && (
                                    <div className="mt-4">
                                        <h5 className="text-md font-semibold text-gray-700">
                                            {days.find((d) => d.id === selectedDays[doctor.doctorId])?.label}
                                        </h5>
                                        <ul className="text-gray-600 text-sm mt-2 space-y-1">
                                            {doctor.slots
                                                .filter((slot) => slot.day === selectedDays[doctor.doctorId])
                                                .map((slot) => (
                                                    <li key={slot.slotId} className="bg-gray-100 px-3 py-1 rounded-md text-md">
                                                        {slot.timingFrom} - {slot.timingTo} ({slot.slotGap} min gap)
                                                    </li>
                                                ))}
                                        </ul>
                                        {doctor.slots.filter((slot) => slot.day === selectedDays[doctor.doctorId]).length === 0 && (
                                            <p className="text-gray-500 text-sm mt-2">No slots available for this day.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="flex items-center mt-5 space-x-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={doctor.isActiveDoctorClinic}
                                onChange={(e) => handleDoctorClinicStatus(doctor.doctorId, e.target.checked)}
                                className="form-checkbox"
                            />
                            <span>{doctor.isActiveDoctorClinic ? "Consultation Active" : "Consultation Inactive"}</span>
                        </div>
                        {!idClinic && (
                            <>
                                <button
                                    className="w-full bg-blue-500 mt-2 text-white py-2 rounded-md hover:bg-blue-600 transition"
                                    onClick={() => handleSlots(clinicId, doctor.doctorId)}
                                >
                                    Edit Slots
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
            {/* Doctor Modal */}
            {isModalOpen && (
                <DoctorModal
                    isOpen={isModalOpen}
                    closeModal={() => setIsModalOpen(false)}
                    doctorData={selectedDoctor}
                    clinicId={clinicId}
                    fromClinic={true}
                    onSubmit={handleSubmit}
                />
            )}
            {/* Clinic Modal */}
            <ClinicModal
                isOpen={isClinicModalOpen}
                closeModal={() => setIsClinicModalOpen(false)}
                clinicData={clinicData}
                onSubmit={handleClinicEditSubmit}
            />
            {/*Doctor to clinic modal*/}
            <DoctorToClinicModal
                isOpen={isDoctorToClinicModalOpen}
                closeModal={() => setIsDoctorToClinicModalOpen(false)}
                clinicId={clinicId}
                onDoctorAdded={fetchClinicDetails}
            />
        </div>
    );
};

export default ClinicDetailsPage;
