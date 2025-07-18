import { format } from "date-fns";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import DefaultImage from "../../../assets/images/default-doctor.png";
import { getDoctorClinic, bookFromClinic, getPatients } from "../../../services/clinics";
import visitReasons from "../../../lib/reasonOptions";
import { getDoctorSlots, bookSlot } from "../../../services/doctors";
import AddPatientModal from "../../../components/Organs/Patient/PatientModal";
import BackButton from "../../../components/Atoms/BackButton";
import { getISTDate, isPastSlot } from "../../../utils/time";
import Calendar from "../../../components/Atoms/Calender";
import days from "../../../lib/slotDays";

const BookSlots = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const clinic = userDetails?.clinicId;
    const isClinicBooking = !!clinic;
    const navigate = useNavigate();
    const today = getISTDate();

    const { doctorId, clinicId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState("");
    const [booking, setBooking] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [patientQuery, setPatientQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState(false);
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isEmergency, setIsEmergency] = useState(false);

    useEffect(() => {
        if (selectedDay) {
            return;
        }
        if (selectedDate instanceof Date && !isNaN(selectedDate)) {
            const dayLabel = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
            const dayMatch = days.find(day => day.label === dayLabel);
            if (dayMatch) setSelectedDay(dayMatch.id);
        }
    }, [selectedDate]);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await getDoctorClinic(clinicId, doctorId);
                setDoctor(response.data.data.doctor);
            } catch (error) {
                toast.error("Failed to fetch doctor details.");
            }
        };
        fetchDoctorDetails();
    }, [doctorId, clinicId]);

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            if (!selectedDay) return;
            try {
                const formattedDate = format(selectedDate, "yyyy-MM-dd");
                const response = await getDoctorSlots(clinicId, doctorId, formattedDate, selectedDay);
                setSlots(response.data.slots || []);
                setSelectedSlot(null);
                setReason("");
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch available slots.");
                setSlots([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [doctorId, clinicId, selectedDate]);

    const handleSearchPatient = async () => {
        if (!patientQuery.trim()) {
            toast.error("Please enter email or contact number.");
            return;
        }
        try {
            setSearchQuery(true);
            const response = await getPatients(patientQuery);
            setPatients(response.data.patients || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch patient details.");
        } finally {
            setSearchQuery(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedSlot) {
            toast.error("Please select a slot to book.");
            return;
        }
        if (!reason.trim()) {
            toast.error("Please enter a reason for the visit.");
            return;
        }
        if (isClinicBooking && !selectedPatient) {
            toast.error("Please select a patient.");
            return;
        }

        setBooking(true);
        try {
            const formattedDate = format(selectedDate, "yyyy-MM-dd");
            const isPast = isPastSlot(selectedSlot, selectedDate);
            if (isPast) {
                toast.error('Selected slot is Expired. Please select another slot.');
                return;
            }
            if (isClinicBooking) {
                await bookFromClinic({ clinicId, doctorId, date: formattedDate, time: selectedSlot, reason, patientId: selectedPatient.userId, isEmergency });
            } else {
                await bookSlot({ clinicId, doctorId, date: formattedDate, time: selectedSlot, reason });
            }
            toast.success("Slot booked successfully!");
            setSlots(prevSlots => prevSlots.map(slot => slot.time === selectedSlot ? { ...slot, booked: true } : slot));
            setIsEmergency(false);
            setSelectedSlot(null);
            setReason("");
            setSelectedPatient(null);
            isClinicBooking ? navigate(`/app/appointments/appointments-management`) : navigate(`/app/appointments/my-appointments`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to book slot.");
        } finally {
            setBooking(false);
        }
    };

    const department = doctor?.speciality

    const handleAddPatient = (newPatient) => {
        setPatients((prevPatients) => [...prevPatients, newPatient]);
        setShowModal(false);
    }

    const handleEmergencyChange = (event) => {
        if (format(selectedDate, "yyyy-MM-dd") !== today) {
            toast.error("Emergency appointments can only be booked for today.");
            return;
        }
        setIsEmergency(event.target.checked);
    };

    const handleDateSelect = ({ date, day }) => {
        setSelectedDate(date);
        setSelectedDay(day);
        setIsEmergency(false);
    };

    const formattedSlotTime = selectedSlot
        ? new Date(`1970-01-01T${selectedSlot}`)?.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        })
        : null;

    const buttonLabel = booking
        ? "Booking..."
        : formattedSlotTime
            ? `Book Slot (${formattedSlotTime})`
            : "Select a Slot to Book";

    return (
        <section className="p-4 flex flex-col min-h-[calc(100vh-80px)] mt-5 md:mt-0 bg-[#f0f0ff] rounded-3xl">
            <div className="flex flex-col w-full p-5">
                <BackButton />
            </div>
            {doctor ? (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 p-5 rounded-xl shadow-sm">
                    <img
                        src={doctor.profilePicture || DefaultImage}
                        alt={doctor.firstName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />

                    <div className="text-center sm:text-left flex-1">
                        <h2 className="text-xl font-semibold text-purple-900 bg-purple-100 px-4 py-2 rounded-lg inline-block capitalize">
                            Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                        </h2>

                        <div className="mt-2 space-y-1">
                            <p className="text-gray-700 text-base font-medium">{doctor.speciality}</p>
                            <p className="text-gray-500 text-sm">{doctor.qualifications}</p>
                            <p className="text-gray-500 text-sm">Experience: {doctor.experience} years</p>
                            <p className="text-gray-600 text-base mt-2 font-semibold">
                                Consultation Fee:{' '}
                                {doctor.consultationFee ? `Rs. ${doctor.consultationFee} /-` : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

            ) : (
                <p className="text-center text-gray-500 text-lg">Loading doctor details...</p>
            )}
            <Calendar onDateSelect={handleDateSelect} />
            {isClinicBooking && (
                <div className="my-4 px-5">
                    <div className="mb-4 flex items-center space-x-3 p-3 rounded-md">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={isEmergency}
                            onChange={handleEmergencyChange}
                            disabled={format(selectedDate, "yyyy-MM-dd") !== today}
                            className="form-checkbox w-6 h-6 text-red-500 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className={`font-semibold text-lg ${isEmergency ? "text-red-600" : "text-gray-800"}`}>
                            🚨 Emergency Appointment
                        </span>
                    </div>
                    <label className="block text-gray-700 font-semibold mb-2">Enter Patient Details:</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={patientQuery}
                            onChange={(e) => setPatientQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearchPatient();
                            }}
                            placeholder="Enter First Name, Last Name, email or contact number"
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800"
                        />
                        <button onClick={handleSearchPatient} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-purple-700" disabled={searchQuery}>Search</button>
                    </div>
                    {!searchQuery && patients.length > 0 ? (
                        <div className="mt-5 text-black">
                            {patients.map((patient, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center bg-white p-3 cursor-pointer transition duration-300 m-2 hover:bg-gray-100 rounded-md ${selectedPatient?.userId === patient.userId ? "bg-purple-100 border-l-8 border-purple-500" : "border-l-4 bg-gray-100"}`}
                                    onClick={() => setSelectedPatient(patient)}
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800 capitalize">{patient.firstName}{patient.middleName ? ` ${patient.middleName}` : ''} {patient.lastName ? `${patient.lastName}` : ''}</p>
                                        <p className="text-sm text-gray-600">{patient.contactNo || "Contact Not Available"} • {patient.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !searchQuery && patients.length === 0 && <p className="mt-2 text-gray-500">No patients found.</p>
                    )}
                    {searchQuery && <p className="mt-2 text-gray-500">Searching for Patients...</p>}
                    <button onClick={() => setShowModal(true)} className="bg-indigo-500 text-white px-4 py-2 rounded-md mt-10 w-40 hover:bg-purple-700">
                        Add new Patient
                    </button>
                </div>
            )}
            <div className="px-5">
                <h3 className="text-lg font-semibold text-gray-800 my-5 ">Available Slots</h3>
                {loading ? (
                    <ul className="grid grid-cols-2 h-32 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, index) => (
                            <li key={index} className="p-4 rounded-lg bg-gray-200 animate-pulse"></li>
                        ))}
                    </ul>
                ) : slots.length > 0 ? (
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {slots.map((slot, index) => {
                            const isPastTime = isPastSlot(slot.time, selectedDate);
                            const isSelected = selectedSlot === slot.time;
                            const isDisabled = slot.booked || isPastTime;

                            const [slotHour, slotMinute] = slot.time.split(":").map(Number);
                            const slotDateTime = new Date(selectedDate);
                            slotDateTime.setHours(slotHour, slotMinute, 0, 0);

                            return (
                                <li
                                    key={index}
                                    className={`p-2.5 text-sm text-center rounded-md cursor-pointer transition-all duration-300 ${isDisabled
                                        ? "text-red-400 bg-gray-300 cursor-no-drop"
                                        : isSelected
                                            ? "bg-indigo-500 text-white border border-green-700"
                                            : "bg-white text-neutral-800 hover:bg-indigo-50"
                                        }`}
                                    onClick={() => {
                                        if (!isDisabled) {
                                            setSelectedSlot(slot.time);
                                        }
                                    }}
                                >
                                    {slotDateTime.toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                    })}
                                </li>
                            );
                        })}
                    </ul>

                ) : (
                    <p className="text-gray-500 mt-32">No slots available for this date.</p>
                )}
            </div>
            {selectedSlot && (
                <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Reason for visit:</h3>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="w-full px-4 py-2 border rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {visitReasons[department?.charAt(0).toUpperCase() + department?.slice(1)]?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-600 mb-1">Common reasons:</h4>
                            <div className="flex flex-wrap gap-2">
                                {visitReasons[department?.charAt(0).toUpperCase() + department?.slice(1)].map((item, idx) => (

                                    <button
                                        key={idx}
                                        onClick={() => setReason(item)}
                                        className="px-3 py-1 bg-gray-200 text-sm rounded-full hover:bg-indigo-200 transition"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className=" flex justify-center items-center">
                <button
                    onClick={handleBooking}
                    disabled={!selectedSlot || !reason.trim() || booking}
                    className={`mt-6 md:px-40 px-5 py-2 text-sm rounded-md text-white font-semibold transition-all duration-300 ${selectedSlot && reason.trim()
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-500 cursor-not-allowed"
                        }`}
                >
                    {buttonLabel}
                </button>
            </div>

            {showModal && <AddPatientModal onClose={() => setShowModal(false)} onPatientAdded={handleAddPatient} clinicId={clinicId} />}
        </section>
    );
};

export default BookSlots;
