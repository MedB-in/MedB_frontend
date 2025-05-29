const PrescriptionModal = ({ selectedRecord, setShowModal, handlePrint }) => {
    if (!selectedRecord) return null;

    return (
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
    );
};

export default PrescriptionModal;
