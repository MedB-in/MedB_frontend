import { useState } from "react";
import { updateAppointmentStatus } from "../../../services/clinics";
import toast from "react-hot-toast";

const AppointmentStatusModal = ({ appointment, isOpen, onClose, updateAppointment }) => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!status) return;
        setLoading(true);
        try {
            const response = await updateAppointmentStatus(appointment.appointmentId, status);
            if (response.data.data === 1) { 
                updateAppointment({...appointment,appointmentStatus:status}); 
                toast.success("Appointment status updated successfully.");
                onClose();
            } else {
                throw new Error("Failed to update status.");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status. Try again.");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-lg font-semibold mb-4">Update Status</h2>
                <p className="mb-4">Appointment for {appointment?.patientFirstName} {appointment?.patientLastName}</p>
                
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                    disabled={loading}
                >
                    <option value="">Select Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentStatusModal;
