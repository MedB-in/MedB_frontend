const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
};

const PrescriptionPrint = ({ selectedRecord, patientName, age, gender, printRef }) => {
    return (
        <div ref={printRef} className="print-area hidden print:block text-black p-6">
            {selectedRecord && (
                <div className="p-6 max-w-3xl mx-auto bg-white text-gray-800 font-sans print:p-0 print:shadow-none">
                    <div className="flex justify-between mb-6 border-b pb-4">
                        <div>
                            <p>
                                <span className="font-semibold">Patient Name:</span> {patientName || "N/A"}
                            </p>
                            <p>
                                <span className="font-semibold">Age/Gender:</span> {age || "N/A"} / {gender || "N/A"}
                            </p>
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
                            <p>
                                <span className="font-semibold">Date:</span>{" "}
                                {formatDate(selectedRecord.appointmentDate)}
                            </p>
                            <p>
                                <span className="font-semibold">Appt.ID:</span> {selectedRecord.appointmentId}
                            </p>
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
                                    <li key={i}>
                                        Problems/Issues: {c.complaint || "N/A"} — Duration: {c.duration || "N/A"}
                                    </li>
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
    );
};

export default PrescriptionPrint;
