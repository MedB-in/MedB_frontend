import { useState } from "react";
import CountdownTimer from "../../Atoms/Patient/CountdownTimer";
import HistoryIcon from "../../../assets/images/prescritpion/history-icon.svg";

const PatientHeader = ({ timer, patient, healthFiles }) => {
    const [showModal, setShowModal] = useState(false);

    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB").split("/").join("-");

    // Format appointment date nicely
    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    return (
        <>
            <div className="border border-black/30 rounded-2xl px-6 py-4">
                <div className="flex flex-wrap justify-between gap-8">
                    <div className="flex flex-1 items-center gap-6 min-w-[300px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-[120px] h-[120px] rounded-full border-2 border-black overflow-hidden">
                                <img
                                    src={
                                        patient?.profilePicture
                                            ? patient.profilePicture
                                            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                    }
                                    alt="Patient"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-black text-lg font-semibold text-center">
                                Mr. {patient?.firstName} {patient?.middleName ? ` ${patient.middleName}` : ""}{" "}
                                {patient?.lastName ? ` ${patient.lastName}` : ""}
                            </div>
                        </div>

                        <div className="flex flex-col justify-center gap-4 flex-1 min-w-[280px]">
                            <div className="bg-[rgba(134,207,195,0.2)] rounded-xl p-4 grid grid-cols-2 gap-y-3 text-sm text-black">
                                <div className="font-normal">Address</div>
                                <div className="font-medium">
                                    : {patient?.address}, {patient?.city}, {patient?.district}, {patient?.state},{" "}
                                    {patient?.country}
                                </div>
                                <div className="font-normal">Age/Sex</div>
                                <div className="font-medium">
                                    : {patient?.age} Years/{patient?.gender}
                                </div>
                                <div className="font-normal">Patient ID</div>
                                <div className="font-medium">: {patient?.userId}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center gap-6 items-end min-w-[250px]">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setShowModal(true)}>
                            <div className="flex flex-col items-center gap-4">
                                <CountdownTimer initialMinutes={timer} initialSeconds={0} />
                                <div className="bg-gray-100 text-gray-600 font-bold text-md px-2 py-1 rounded-md whitespace-nowrap">
                                    {formattedDate}
                                </div>
                            </div>
                            <div className="text-sm text-center text-black leading-tight select-none">
                                Previous
                                <br />
                                History
                                <div className="bg-white shadow-md p-2 rounded-md w-[66px] h-[66px] flex items-center justify-center">
                                    <img src={HistoryIcon} alt="Data Icon" className="w-[54px] object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl font-bold"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-semibold mb-6 text-center">Health History</h2>

                        {!healthFiles || healthFiles.length === 0 ? (
                            <p className="text-center text-gray-500">No health history records available.</p>
                        ) : (
                            healthFiles.map((file) => (
                                <div
                                    key={file.appointmentId}
                                    className="border border-gray-200 rounded-lg p-4 mb-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-semibold text-lg">
                                            Appointment Date: {formatDate(file.appointmentDate)}
                                        </div>
                                        <div className="text-sm text-gray-600">ID: {file.appointmentId}</div>
                                    </div>

                                    <div className="mb-2">
                                        <div className="font-medium">Diagnosis:</div>
                                        <div className="text-gray-700">{file.diagnosis || "No diagnosis provided"}</div>
                                    </div>

                                    <div className="mb-2">
                                        <div className="font-medium">Notes:</div>
                                        <div className="text-gray-700">{file.notes || "No notes available"}</div>
                                    </div>

                                    <div className="mb-2">
                                        <div className="font-medium mb-1">Complaints:</div>
                                        {file.complaints && file.complaints.length > 0 ? (
                                            <ul className="list-disc list-inside text-gray-700">
                                                {file.complaints.map((complaint, i) => (
                                                    <li key={i}>
                                                        {complaint.complaint} - Duration: {complaint.duration || "N/A"}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-gray-500 italic">No complaints recorded.</div>
                                        )}
                                    </div>

                                    <div>
                                        <div className="font-medium mb-1">Prescriptions:</div>
                                        {file.prescriptions && file.prescriptions.length > 0 ? (
                                            <ul className="list-disc list-inside text-gray-700">
                                                {file.prescriptions.map((med, i) => (
                                                    <li key={i}>
                                                        <span className="font-semibold">{med.medicineName}</span> — Dosage: {med.dosage}, Frequency: {med.frequency}, Duration: {med.duration}
                                                        {med.remarks ? `, Remarks: ${med.remarks}` : ""}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-gray-500 italic">No prescriptions recorded.</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default PatientHeader;
