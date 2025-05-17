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
import DoctorCard from "../../../components/Organs/Doctors/DoctorCard";
import BackButton from "../../../components/Atoms/BackButton";

const ClinicDetailsPage = ({ idClinic }) => {
    let { clinicId } = useParams();
    if (idClinic)
        clinicId = idClinic
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [clinic, setClinic] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
    const [isDoctorToClinicModalOpen, setIsDoctorToClinicModalOpen] = useState(false);
    const [clinicData, setClinicData] = useState(null);
    const [selectedDays, setSelectedDays] = useState({});
    const storedSelectedMenu = JSON.parse(localStorage.getItem('selectedMenu'));
    const menuRights = storedSelectedMenu?.rights

    const fetchClinicDetails = async () => {
        try {
            setLoading(true);
            const data = await getClinicById(clinicId);
            setClinic(data.data.data);
            setDoctors(data.data.data.doctors || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch clinic details.");
        } finally {
            setLoading(false);
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
        navigate(`/app/clinics/slots/${clinicId}/${doctorId}`);
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


    const handleClinicEditSubmit = async (data, clinicId) => {
        try {
            const response = await editClinic(clinicId, data);
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
        navigate(`/app/clinics/users/${clinicId}`);
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
            <BackButton />
            {loading ? (<>
                <div className="animate-pulse bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl p-6 rounded-2xl w-full flex flex-col md:flex-row items-center md:items-start gap-6 border border-gray-200">
                    <div className="w-full md:w-1/3 h-48 md:h-56 bg-gray-300 rounded-lg shadow-md border border-gray-300" />
                    <div className="flex-1 space-y-3 w-full">
                        <div className="h-8 bg-gray-300 rounded w-2/3" />
                        <div className="h-5 bg-gray-300 rounded w-3/4" />
                        <div className="h-5 bg-gray-200 rounded w-1/2" />
                        <div className="h-5 bg-gray-300 rounded w-1/2" />
                        <div className="h-5 bg-gray-300 rounded w-2/3" />
                        <div className="h-5 bg-gray-200 rounded w-1/3" />
                    </div>
                    <div className="w-[25px] h-[25px] bg-gray-300 rounded-full" />
                </div>
            </>
            ) : (
                <>
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
                </>
            )}
            {(!idClinic || menuRights.createAllowed === true) && (
                <>
                    <button
                        title="Add New Doctor"
                        className="bg-blue-500 my-5 mr-5 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                        onClick={() => handleClinicUsers()}
                    >Manage Clinic Users
                    </button>
                    {!idClinic && (
                        <>
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
                </>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.doctorId}
                        doctor={doctor}
                        days={days}
                        clinicId={clinicId}
                        idClinic={idClinic}
                        selectedDays={selectedDays}
                        menuRights={menuRights}
                        toggleSelectedDay={toggleSelectedDay}
                        handleEditDoctor={handleEditDoctor}
                        handleDoctorClinicStatus={handleDoctorClinicStatus}
                        handleSlots={handleSlots}
                    />
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
