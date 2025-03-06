import { format } from "date-fns";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import DefaultImage from "../../../assets/images/default-doctor.png";
import days from "../../../lib/slotDays";
import { getDoctorClinic, bookFromClinic, getPatients } from "../../../services/clinics";
import { getDoctorSlots, bookSlot } from "../../../services/doctors";
import AddPatientModal from "../../../components/Organs/Patient/PatientModal";

const BookSlots = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const clinic = userDetails?.clinicId;
    const isClinicBooking = !!clinic;

    const { doctorId, clinicId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
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
            try {
                const formattedDate = format(selectedDate, "yyyy-MM-dd");
                const selectedDayLabel = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
                const selectedDay = days.find(day => day.label === selectedDayLabel);

                if (!selectedDay) {
                    toast.error("Invalid day selection.");
                    return;
                }
                const response = await getDoctorSlots(clinicId, doctorId, formattedDate, selectedDay.id);
                setSlots(response.data.slots || []);
                setSelectedSlot(null);
                setReason("");
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch available slots.");
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
            if (response.data.patients.length !== 0) {
                setSearchQuery(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch patient details.");
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
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to book slot.");
        } finally {
            setBooking(false);
        }
    };

    const handleAddPatient = (newPatient) => {
        setPatients((prevPatients) => [...prevPatients, newPatient]);
        setShowModal(false);
    }

    const handleEmergencyChange = (event) => {
        if (format(selectedDate, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd")) {
            toast.error("Emergency appointments can only be booked for today.");
            return;
        }
        setIsEmergency(event.target.checked);
    };

    return (
        <div className="p-6 relative bg-white bg-opacity-10 backdrop-blur-lg rounded-xl shadow-md">
            {doctor ? (
                <div className="flex items-center gap-4 mb-6">
                    <img
                        src={doctor.profilePicture || DefaultImage}
                        alt={doctor.firstName}
                        className="w-24 h-24 rounded-full object-cover border"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">
                            Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                        </h2>
                        <p>{doctor.speciality}</p>
                        <p className="text-gray-500">{doctor.qualifications}</p>
                        <p className="text-gray-500">Experience: {doctor.experience} years</p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">Loading doctor details...</p>
            )}
            <div className="mb-4 relative">
                <label className="block text-gray-500 font-semibold mb-2">Select Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()}
                    dateFormat="dd-MM-yyyy"
                    className="px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800 w-full"
                />
            </div>
            {isClinicBooking && (
                <div className="mb-4">
                    <div className="mb-4 flex items-center space-x-3 p-3 border rounded-md bg-gray-100">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={isEmergency}
                            onChange={handleEmergencyChange}
                            disabled={format(selectedDate, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd")}
                            className="form-checkbox w-6 h-6 text-red-500 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className={`font-semibold text-lg ${isEmergency ? "text-red-600" : "text-gray-800"}`}>
                            🚨 Emergency Appointment
                        </span>
                    </div>
                    <label className="block text-gray-500 font-semibold mb-2">Enter Patient Details:</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={patientQuery}
                            onChange={(e) => setPatientQuery(e.target.value)}
                            placeholder="Enter First Name, Last Name, email or contact number"
                            className="w-full px-4 py-2 border rounded-md bg-white text-gray-800"
                        />
                        <button onClick={handleSearchPatient} className="bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
                    </div>
                    {patients.length > 0 ? (
                        <div className="mt-2 bg-white text-black">
                            {patients.map((patient, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center p-3 cursor-pointer transition duration-300 m-2 hover:bg-gray-100 rounded-md ${selectedPatient?.userId === patient.userId ? "bg-blue-100 border-l-4 border-blue-500" : "border-l-4 bg-gray-100"}`}
                                    onClick={() => setSelectedPatient(patient)}
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">{patient.firstName}{patient.middleName ? ` ${patient.middleName}` : ''} {patient.lastName ? `${patient.lastName}` : ''}</p>
                                        <p className="text-sm text-gray-600">{patient.contactNo || "Contact Not Available"} • {patient.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        searchQuery && patients.length === 0 && !loading && <p className="mt-2 text-gray-500">No patients found.</p>
                    )}
                    <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-10 w-40">
                        Add new Patient
                    </button>
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Available Slots</h3>
                {loading ? (
                    <p className="text-gray-400">Loading slots...</p>
                ) : slots.length > 0 ? (
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {slots.map((slot, index) => (
                            <li
                                key={index}
                                className={`p-4 rounded-lg text-center cursor-pointer transition-all duration-300 ${slot.booked
                                    ? "text-gray-500 bg-gray-700 cursor-not-allowed"
                                    : "text-white bg-blue-500 hover:bg-blue-600"
                                    }`}
                                onClick={() => !slot.booked && setSelectedSlot(slot.time)}
                            >
                                <span className="text-lg font-medium">
                                    {new Date(`1970-01-01T${slot.time}`).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                    })}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400 mt-32">No slots available for this date.</p>
                )}
            </div>
            {selectedSlot && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Reason for visit:</h3>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason for visit..."
                        className="w-full px-4 py-2 border rounded-md bg-green-100 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}
            <button
                onClick={handleBooking}
                disabled={!selectedSlot || !reason.trim() || booking}
                className={`mt-6 w-full py-3 rounded-md text-white text-lg font-semibold transition-all duration-300 ${selectedSlot && reason.trim()
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-gray-500 cursor-not-allowed"
                    }`}
            >
                {booking ? "Booking..." : selectedSlot ? `Book Slot (${selectedSlot})` : "Select a Slot to Book"}
            </button>
            {showModal && <AddPatientModal onClose={() => setShowModal(false)} onPatientAdded={handleAddPatient} clinicId={clinicId} />}
        </div>
    );
};

export default BookSlots;
