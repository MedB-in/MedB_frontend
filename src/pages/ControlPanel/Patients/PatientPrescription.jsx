import { useEffect, useRef, useState } from "react";
import { getPrescriptionDataForPatient } from "../../../services/patient";
import { toast } from "react-hot-toast";

const PatientPrescription = () => {
    const [showModal, setShowModal] = useState(false);
    const [healthFiles, setHealthFiles] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const printRef = useRef(null);
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const patientId = userDetails?.userId;
    const patientName = [userDetails?.firstName, userDetails?.middleName, userDetails?.lastName].filter(Boolean).map(capitalize).join(" ");
    const age = userDetails?.age;
    const gender = userDetails?.gender;

    useEffect(() => {
        fetchPrescriptionData();
    }, []);

    const fetchPrescriptionData = async () => {
        try {
            const response = await getPrescriptionDataForPatient(patientId);
            setHealthFiles(response.data.healthFiles || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">My Appointments</h1>

                {healthFiles.length === 0 ? (
                    <p className="text-center text-gray-500">No appointments available.</p>
                ) : (
                    <div className="grid gap-6">
                        {healthFiles.map((file) => (
                            <div
                                key={file.appointmentId}
                                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                                onClick={() => {
                                    setSelectedRecord(file);
                                    setShowModal(true);
                                }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                        <p className="text-sm text-gray-500">Appointment Date</p>
                                        <p className="font-semibold text-lg text-gray-800">{formatDate(file.appointmentDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Doctor</p>
                                        <p className="font-medium text-gray-700 capitalize">
                                            {file.doctor.firstName} {file.doctor.middleName || ""} {file.doctor.lastName || ""}
                                        </p>
                                        <span>{file.doctor.speciality}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Clinic</p>
                                        <p className="font-medium text-gray-700">{file.clinic.name || "N/A"}</p>
                                        <span>{file.clinic.address || "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 no-print">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-semibold mb-6 text-center">Prescription Details</h2>

                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Appointment ID</p>
                            <p className="font-semibold">{selectedRecord.appointmentId}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium">Diagnosis:</p>
                            <p className="text-gray-700">{selectedRecord.diagnosis || "No diagnosis provided"}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium">Notes:</p>
                            <p className="text-gray-700">{selectedRecord.notes || "No notes available"}</p>
                        </div>
                        <div className="mb-4">
                            <p className="font-medium mb-1">Problems/Issues:</p>
                            {selectedRecord.complaints?.length > 0 ? (
                                <ul className="list-disc list-inside text-gray-700">
                                    {selectedRecord.complaints.map((c, i) => (
                                        <li key={i}>{c.complaint} - Duration: {c.duration || "N/A"}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No Problems/Issues recorded.</p>
                            )}
                        </div>
                        <div>
                            <p className="font-medium mb-1">Prescriptions:</p>
                            {selectedRecord.prescriptions?.length > 0 ? (
                                <ul className="list-disc list-inside text-gray-700">
                                    {selectedRecord.prescriptions.map((med, i) => (
                                        <li key={i}>
                                            <span className="font-semibold">{med.medicineName}</span> — Dosage: {med.dosage}, Frequency: {med.frequency}, Duration: {med.duration}
                                            {med.remarks ? `, Remarks: ${med.remarks}` : ", Remarks: Nil"}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No prescriptions recorded.</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handlePrint}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            >
                                Print Prescription
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print-Only Area */}
            <div ref={printRef} className="print-area hidden print:block text-black p-6">
                {selectedRecord && (
                    <div className="p-6 max-w-3xl mx-auto bg-white text-gray-800 font-sans print:p-0 print:shadow-none">
                        <div className="flex justify-between mb-6 border-b pb-4">
                            <div>
                                <p><span className="font-semibold">Patient Name:</span> {patientName || "N/A"}</p>
                                <p><span className="font-semibold">Age/Gender:</span> {age || "N/A"} / {gender || "N/A"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-semibold">
                                    Dr. {selectedRecord.doctor.firstName}{" "}
                                    {selectedRecord.doctor.middleName || ""}{" "}
                                    {selectedRecord.doctor.lastName || ""}
                                </p>
                                <p className="text-sm text-gray-600">{selectedRecord.doctor.speciality}</p>
                            </div>
                        </div>
                        <div className="flex justify-between mb-6 border-b pb-4">
                            <div>
                                <p><span className="font-semibold">Date:</span> {formatDate(selectedRecord.appointmentDate)}</p>
                                <p><span className="font-semibold">Appt.ID:</span> {selectedRecord.appointmentId}</p>
                            </div>
                            <div>
                                <h3 className="text-lg text-right font-bold">{selectedRecord.clinic.name}</h3>
                                <p className="text-sm text-gray-600">{selectedRecord.clinic.address}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-1">Diagnosis</h4>
                            <p className="text-sm">{selectedRecord.diagnosis || "No diagnosis provided"}</p>
                        </div>
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-1">Problems / Issues</h4>
                            {selectedRecord.complaints?.length > 0 ? (
                                <ul className="list-disc list-inside text-sm text-gray-700">
                                    {selectedRecord.complaints.map((c, i) => (
                                        <li key={i}>Problems/Issues: {c.complaint || "N/A"} — Duration: {c.duration || "N/A"}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="italic text-sm text-gray-600">No problems/issues recorded.</p>
                            )}
                        </div>
                        <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">Prescriptions</h4>
                            {selectedRecord.prescriptions?.length > 0 ? (
                                <table className="w-full text-sm border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="text-left px-2 py-1 border-b">Medicine</th>
                                            <th className="text-left px-2 py-1 border-b">Dosage</th>
                                            <th className="text-left px-2 py-1 border-b">Frequency</th>
                                            <th className="text-left px-2 py-1 border-b">Duration</th>
                                            <th className="text-left px-2 py-1 border-b">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedRecord.prescriptions.map((med, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="px-2 py-1">{med.medicineName}</td>
                                                <td className="px-2 py-1">{med.dosage}</td>
                                                <td className="px-2 py-1">{med.frequency}</td>
                                                <td className="px-2 py-1">{med.duration}</td>
                                                <td className="px-2 py-1">{med.remarks || "Nil"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="italic text-sm text-gray-600">No prescriptions recorded.</p>
                            )}
                        </div>
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-1">Doctor's Notes/Remarks</h4>
                        </div>
                        <div className="mt-20 flex items-end justify-end pr-4">
                            <p className="text-sm italic text-gray-800">
                                Dr. {selectedRecord.doctor.firstName} {selectedRecord.doctor.lastName}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientPrescription;
