import { useState } from "react";
import { assignPatientToken } from "../../../services/clinics";
import toast from "react-hot-toast";

const AssignTokenModal = ({ appointment, isOpen, onClose }) => {
    const [tokenNo, setTokenNo] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!tokenNo) return;
        setLoading(true);
        try {
            const response = await assignPatientToken(appointment.appointmentId, tokenNo);
            if (response.data) {
                toast.success(response.data.message || "Token assigned successfully.");
                onClose();
            } else {
                throw new Error("Failed to assign token.");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to assign token. Try again.");
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-lg font-semibold mb-4">Assign Token</h2>
                <p className="mb-4">Appointment for {appointment?.patientFirstName} {appointment?.patientLastName}</p>

                <input
                    type="number"
                    value={tokenNo}
                    onChange={(e) => setTokenNo(e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                    placeholder="Enter Token Number"
                    disabled={loading}
                />
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

export default AssignTokenModal;