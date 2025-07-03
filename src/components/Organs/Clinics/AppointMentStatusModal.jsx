import { useState } from "react";
import Swal from "sweetalert2";
import { updateAppointmentStatus } from "../../../services/clinics";
import toast from "react-hot-toast";
import Calendar from "../../Atoms/Calender";
import TimeSlots from "../../Atoms/TImeSlots";
import { bookSlot } from "../../../services/doctors";

const AppointmentStatusModal = ({ appointment, isOpen, onClose, updateAppointment, today, clinicId, setAppointment }) => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const doctorId = appointment?.doctorId;

    const handleDateSelect = ({ date, day }) => {
        setSelectedDate(date);
        setSelectedDay(day);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleSubmit = async () => {
        if (!status) {
            toast.error("Please select a status.");
            setLoading(false);
            return;
        }
        if (reason.trim() === "" && status === "Cancelled") {
            toast.error("Please enter a reason for the visit.");
            setLoading(false);
            return;
        }
        if (status === "Completed" || status === "Cancelled") {
            const result = await Swal.fire({
                title: "Consultation Status",
                text: `Are you sure you want to set the status to ${status === "Completed" ? "Completed" : "Cancelled"}?`,
                showCancelButton: true,
                confirmButtonColor: "#6F64E7",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Confirm!",
            });
            if (!result.isConfirmed) return;
        }

        setLoading(true);
        try {
            if (status === "Reschedule") {
                if (!selectedDate || !selectedDay || !selectedSlot) {
                    toast.error('Please select a date and time before submitting.');
                    setLoading(false);
                    return;
                }
                if (!reason.trim()) {
                    toast.error("Please enter a reason for the visit.");
                    setLoading(false);
                    return;
                }
                const result = await Swal.fire({
                    title: "Reschedule Appointment",
                    text: `Are you sure you want to reschedule the appointment?`,
                    showCancelButton: true,
                    confirmButtonColor: "#6F64E7",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Confirm!",
                });
                if (!result.isConfirmed) return;

                await bookSlot({ appointmentId: appointment.appointmentId, patientId: appointment.userId, clinicId, doctorId, date: selectedDate, time: selectedSlot, reason });
                setAppointment();
                toast.success("Slot booked successfully!");
                onClose();
            } else {
                const response = await updateAppointmentStatus(appointment.appointmentId, status, reason);
                if (response.data.data === 1) {
                    updateAppointment({ ...appointment, appointmentStatus: status, cancellationReason: reason });
                    setStatus('');
                    setReason('');
                    toast.success("Appointment status updated successfully.");
                    onClose();
                } else {
                    throw new Error("Failed to update status.");
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update appointment. Try again.");
        }
        setLoading(false);
    };

    const handleClose = () => {
        setStatus('');
        setReason('');
        setSelectedDate(null);
        setSelectedDay(null);
        setSelectedSlot(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl bg-white border border-white/20 rounded-2xl shadow-2xl p-6 text-white transition-all duration-300 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <h2 className="text-xl text-black font-semibold mb-4">Update Status</h2>

                <p className="mb-1 text-sm text-black">
                    Appointment for <span className="font-medium">{appointment?.patientFirstName} {appointment?.patientLastName}</span>
                </p>
                <p className="text-sm text-black">Date: {appointment?.appointmentDate}</p>
                <p className="text-sm text-black mb-4">Time: {appointment?.appointmentTime}</p>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-black/10 border text-black border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                    disabled={loading}
                >
                    <option value="">Select Status</option>
                    {today === appointment?.appointmentDate.split("-").reverse().join("-") && <option value="Completed">Completed</option>}
                    <option value="Cancelled">Cancel</option>
                    <option value="Reschedule">Reschedule</option>
                </select>

                {status === "Cancelled" && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Reason for Cancellation</label>
                        <textarea
                            className="w-full p-2 border rounded-md text-black focus:ring-2 focus:ring-indigo-500"
                            rows="3"
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for cancellation..."
                        />
                    </div>
                )}

                {status === "Reschedule" && (
                    <div className="mb-4">
                        <Calendar onDateSelect={handleDateSelect} />
                        <TimeSlots
                            clinicId={clinicId}
                            doctorId={appointment?.doctorId}
                            date={selectedDate}
                            day={selectedDay}
                            onSlotSelect={handleSlotSelect}
                        />
                        {selectedSlot && (
                            <div className="mt-4">
                                <label className="block text-black text-sm font-medium mb-2">Reason for visit:</label>
                                <input
                                    rows="3"
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full p-2 border rounded-md text-black focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter reason for visit..."
                                />
                            </div>
                        )}
                    </div>
                )}


                <div className="flex justify-end mt-5 gap-2">
                    <button onClick={handleClose} className="px-4 py-2 bg-gray-300 text-red-400 hover:bg-gray-600 hover:text-white rounded" disabled={loading}>Close</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>{loading ? "Saving..." : "Confirm"}</button>
                </div>
            </div>
        </div>

    );
};

export default AppointmentStatusModal;
