import { useState } from "react";
import Swal from "sweetalert2";
import Calendar from "../../Atoms/Calender";
import TimeSlots from "../../Atoms/TImeSlots";
import { bookSlot } from "../../../services/doctors";
import toast from "react-hot-toast";

const AppointmentActions = ({ appointment, onClose, fetchAppointments }) => {
    const [reason, setReason] = useState("");
    const [action, setAction] = useState("cancel");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);
    const { clinicId, doctorId } = appointment;

    const handleDateSelect = ({ date, day }) => {
        setSelectedDate(date);
        setSelectedDay(day);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleConfirm = () => {
        if (action === "cancel" && !reason.trim()) {
            Swal.fire("Attention", "Please provide a reason for cancellation.");
            return;
        }
        handleSubmit();
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (action === "reschedule") {
                if (!selectedDate || !selectedDay || !selectedSlot) {
                    toast.error('Please select a date and time before submitting.');
                    return;
                }
                if (!reason.trim()) {
                    toast.error("Please enter a reason for the visit.");
                    return;
                }
                await bookSlot({ appointmentId: appointment.appointmentId, clinicId, doctorId, date: selectedDate, time: selectedSlot, reason });
                toast.success("Slot booked successfully!");
                fetchAppointments();
                onClose();
            } else if (action === "cancel") {
                await bookSlot({ appointmentId: appointment.appointmentId, clinicId, doctorId, date: selectedDate, time: selectedSlot, reason, action: "cancel" });
                toast.success("Slot cancelled successfully!");
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to book slot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
            <div className="bg-white p-6 max-w-2xl w-full max-h-[80vh] overflow-auto rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Manage Appointment</h2>
                <p className="text-sm text-gray-600 mb-4">{appointment?.appointmentDate} at {appointment?.appointmentTime}</p>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Select Action</label>
                    <select
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                    >
                        <option value="cancel">Cancel Appointment</option>
                        <option value="reschedule">Reschedule Appointment</option>
                    </select>
                </div>

                {action === "cancel" && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Reason for Cancellation</label>
                        <textarea
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                            rows="3"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason visit..."
                        />
                    </div>
                )}

                {action === "reschedule" && (
                    <div className="mb-4">
                        <Calendar onDateSelect={handleDateSelect} />
                        <TimeSlots clinicId={clinicId} doctorId={doctorId} date={selectedDate} day={selectedDay} onSlotSelect={handleSlotSelect} />
                        {selectedSlot && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-2">Reason for visit:</label>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter reason..."
                                />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end mt-5 gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded" disabled={loading}>Close</button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-blue-500 text-white rounded" disabled={loading}>{loading ? "Saving..." : "Confirm"}</button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentActions;