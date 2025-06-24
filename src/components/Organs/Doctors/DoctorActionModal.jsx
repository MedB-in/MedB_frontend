import { useNavigate } from "react-router-dom";

const DoctorRemarksModal = ({ appt, onCloseHard }) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onCloseHard}
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl font-bold"
                    title="Close"
                >
                    &times;
                </button>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 border-b pb-4 sm:pb-6 mb-4 sm:mb-6">
                    <img
                        src={appt?.patientDetails?.profilePicture}
                        alt="Patient"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full shadow"
                    />
                    <div className="text-center md:text-left">
                        <h2 className="text-xl sm:text-2xl font-semibold capitalize">
                            {appt?.patientDetails?.firstName}{" "}
                            {appt?.patientDetails?.middleName}{" "}
                            {appt?.patientDetails?.lastName}
                        </h2>
                        <p className="text-sm text-gray-500">Patient ID: {appt?.patientDetails?.userId}</p>
                        <p className="text-sm text-gray-500">Appointment Date: {appt?.appointmentDate}</p>
                        <p className="text-sm text-gray-500">
                            Appointment Status:
                            <span className={`font-semibold ${appt?.appointmentStatus === "Scheduled" ? "text-green-600" : "text-blue-600"}`}>
                                {" "}{appt?.appointmentStatus}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="border rounded-xl hover:shadow-md transition h-full flex flex-col">
                        <div className="p-4 flex flex-col h-full">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-violet-700">Upload/View Prescription or Health Files</h3>
                            <p className="text-sm text-gray-500 mb-4">Upload/View prescriptions, lab reports, or test files.</p>
                            <div className="mt-auto">
                                <button
                                    onClick={() =>
                                        navigate(`/app/patients/prescriptions/${appt?.patientDetails?.userId}/${appt?.doctorId}/${appt?.clinicId}/${appt?.appointmentId}/${appt?.appointmentDate}`)
                                    }
                                    className="w-full bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700 transition"
                                >
                                    Upload/View File
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border rounded-xl hover:shadow-md transition h-full flex flex-col">
                        <div className="p-4 flex flex-col h-full">
                            <h3 className="text-base sm:text-lg font-semibold mb-2 text-green-700">Create New Prescription</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                Enter medicines, problems, and notes. View existing prescriptions and health files.
                            </p>
                            <div className="mt-auto">
                                <button
                                    onClick={() =>
                                        navigate(`/app/patients/prescriptions-new/${appt?.patientDetails?.userId}/${appt?.doctorId}/${appt?.clinicId}/${appt?.appointmentId}/${appt?.appointmentDate}/${appt?.appointmentStatus}`)
                                    }
                                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    Create/View Prescription
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default DoctorRemarksModal;
