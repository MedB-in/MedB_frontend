import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Button from "../../Atoms/Login/Button";
import { getPatientMedHistory, updatePatientMedHistory } from "../../../services/patient";

const DoctorRemarksModal = ({ appt, onClose }) => {
    const [remark, setRemark] = useState('');
    const [previousRemarks, setPreviousRemarks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false);
    const [selectedRemark, setSelectedRemark] = useState(null);

    useEffect(() => {
        if (appt?.patientDetails?.userId) {
            fetchPatientHistory(appt.patientDetails.userId);
        }
    }, [appt]);


    const fetchPatientHistory = async (patientId) => {
        try {
            const response = await getPatientMedHistory(patientId, appt.doctorId);
            setPreviousRemarks(response.data.result || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch medical history");
        }
    };

    const handleChange = (e) => {
        setRemark(e.target.value);
    };

    useEffect(() => {
        if (remark === "" && previousRemarks.length > 0) {
            const prevRemark = previousRemarks.find(r => r.appointmentDate === appt.appointmentDate)?.remarks || "";
            setRemark(prevRemark);
        }
    }, [previousRemarks, appt.appointmentDate]);


    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const response = await updatePatientMedHistory(
                appt.patientDetails.userId,
                appt.doctorId,
                appt.appointmentDate,
                appt.appointmentId,
                { remark }
            );
            toast.success(response.data.message || "Medical history saved successfully");
            setConfirmClose(true);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async () => {
        if (!confirmClose) {
            const isConfirmed = window.confirm("Is the consultation over? Click 'OK' for Yes or 'Cancel' for No.");
            if (!isConfirmed) {
                onClose();
                return;
            }
            else {
                handleSubmit();
            }
        }
        onClose();
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-center mb-6">Patient Diagnosis/Remarks</h2>

                <div className="flex items-center space-x-6 mb-6">
                    <img src={appt?.patientDetails?.profilePicture} alt="Patient" className="w-20 h-20 object-cover rounded-full" />
                    <div>
                        <p className="text-xl font-semibold">{appt?.patientDetails?.firstName} {appt?.patientDetails?.middleName} {appt?.patientDetails?.lastName}</p>
                        <p className="text-lg text-gray-500">{appt?.patientDetails?.email}</p>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <textarea
                        className="w-full p-3 text-lg border rounded resize-none"
                        rows="6"
                        placeholder="Enter your diagnosis/remark..."
                        value={remark}
                        onChange={handleChange}
                    />
                    <div className="flex justify-end space-x-4">
                        <Button type="button" className="bg-gray-500 text-white" onClick={handleClose}>Close</Button>
                        <Button type="submit" className="bg-violet-600 text-white" disabled={loading}>
                            {loading ? "Saving..." : "Save Remark"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <h3 className="text-2xl font-semibold">Previous Records</h3>
                    <div className="mt-4 max-h-64 overflow-y-auto border p-4 rounded bg-gray-100 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        <ul className="space-y-4">
                            {previousRemarks.length > 0 ? (
                                previousRemarks.map((r, index) => (
                                    <li
                                        key={index}
                                        className="p-3 border-b cursor-pointer hover:bg-gray-200 rounded transition"
                                        onClick={() => setSelectedRemark(r)}
                                    >
                                        <p className="text-lg text-gray-600 font-semibold">
                                            <span>{index + 1}:</span>
                                            <span className="font-semibold"> Date:</span> {new Date(r.appointmentDate).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))
                            ) : (
                                <p className="text-lg text-gray-500">No previous records</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {selectedRemark && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <h2 className="text-2xl font-semibold text-center mb-4">Remark Details ({selectedRemark.appointmentDate})</h2>
                        <textarea
                            className="w-full p-3 text-lg border rounded resize-none"
                            rows="6"
                            value={selectedRemark?.remarks || ""}
                            placeholder="No remarks found"
                            readOnly
                        />
                        <div className="flex justify-center space-x-4">
                            <Button className="bg-violet-600 text-white" onClick={() => setSelectedRemark(null)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorRemarksModal;