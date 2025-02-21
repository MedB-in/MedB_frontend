import { format } from "date-fns";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import DefaultImage from "../../../assets/images/default-doctor.png";
import days from "../../../lib/slotDays";
import { getDoctorClinic } from "../../../services/clinics";
import { getDoctorSlots, bookSlot } from "../../../services/doctors";

const BookSlots = () => {
    const { doctorId, clinicId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [booking, setBooking] = useState(false);

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
                const response = await getDoctorSlots(doctorId, clinicId, formattedDate, selectedDay.id);
                setSlots(response.data.slots || []);
                setSelectedSlot(null);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to fetch available slots.");
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [doctorId, clinicId, selectedDate]);

    const handleBooking = async () => {
        if (!selectedSlot) {
            toast.error("Please select a slot to book.");
            return;
        }
        setBooking(true);
        try {
            const formattedDate = format(selectedDate, "yyyy-MM-dd");
            await bookSlot({ clinicId, doctorId, date: formattedDate, time: selectedSlot });
            toast.success("Slot booked successfully!");
            setSlots(prevSlots => prevSlots.map(slot => slot.time === selectedSlot ? { ...slot, booked: true } : slot));
            setSelectedSlot(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to book slot.");
        } finally {
            setBooking(false);
        }
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
                        <p className="">{doctor.speciality}</p>
                        <p className="text-gray-500">{doctor.qualifications}</p>
                        <p className="text-gray-500">Experience: {doctor.experience} years</p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">Loading doctor details...</p>
            )}

            <div className="mb-4">
                <label className="block text-gray-500 font-semibold mb-2">Select Date:</label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()}
                    dateFormat="dd-MM-yyyy"
                    className="px-4 py-2 border rounded-md shadow-sm bg-white text-gray-800"
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-2">Available Slots</h3>
                {loading ? (
                    <p className="text-gray-400">Loading slots...</p>
                ) : slots.length > 0 ? (
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {slots.map((slot, index) => (
                            <li 
                                key={index} 
                                className={`p-4 rounded-lg text-center cursor-pointer ${slot.booked ? "text-gray-500 bg-gray-700 cursor-not-allowed" : "text-white bg-blue-500 hover:bg-blue-600"} transition-all duration-300`} 
                                onClick={() => !slot.booked && setSelectedSlot(slot.time)}
                            >
                                <span className="text-lg font-medium">{slot.time}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No slots available for this date.</p>
                )}
            </div>

            <button
                onClick={handleBooking}
                disabled={!selectedSlot || booking}
                className={`mt-6 w-full py-3 rounded-md text-white text-lg font-semibold transition-all duration-300 ${selectedSlot ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 cursor-not-allowed"}`}
            >
                {booking ? "Booking..." : selectedSlot ? `Book Slot (${selectedSlot})` : "Select a Slot to Book"}
            </button>
        </div>
    );
};

export default BookSlots;