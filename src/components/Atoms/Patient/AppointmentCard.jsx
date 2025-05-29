import { formatTime } from '../../../utils/format';

const AppointmentCard = ({ appt, isDoctor, handleOpenModal, handleAppointmentModal }) => {
    return (
        <div
            onClick={() => {
                if (isDoctor) {
                    handleOpenModal(appt);
                } else {
                    const apptDate = new Date(appt.appointmentDate.split("-").reverse().join("-"));
                    const today = new Date();
                    if (apptDate >= today && appt.appointmentStatus === "Scheduled") {
                        handleAppointmentModal(appt);
                    }
                }
            }}
            className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 flex flex-col gap-4 transform transition-all duration-300 ease-in-out hover:bg-gray-200 hover:shadow-xl cursor-pointer"
        >
            <div className="flex items-center text-left gap-4 border-b pb-3">
                <img
                    src={isDoctor ? appt.patientDetails.profilePicture : appt.profilePicture}
                    alt={isDoctor ? appt.patientDetails.firstName : appt.firstName}
                    className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />
                <div>
                    <p className="text-lg font-semibold">
                        {isDoctor
                            ? `${appt.patientDetails.firstName} ${appt.patientDetails.middleName || ''} ${appt.patientDetails.lastName || ''}`
                            : `${appt.firstName} ${appt.lastName || ''}`}
                    </p>
                    <p className="text-sm text-gray-600">{isDoctor ? "" : appt.speciality}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-x-1 gap-y-3 text-sm text-left">
                <p className="font-medium text-gray-800">📅 Date:</p>
                <p className="text-gray-700">{appt.appointmentDate}</p>

                <p className="font-medium text-gray-800">⏰ Time:</p>
                <p className="text-gray-700">{formatTime(appt.appointmentTime)}</p>

                <p className="font-medium text-gray-800">🏥 Clinic:</p>
                <p className="text-gray-700">{appt.clinicName}</p>

                <p className="font-medium text-gray-800">📌 Status:</p>
                <p
                    className={`font-semibold ${appt.appointmentStatus === "Scheduled"
                        ? "text-blue-600"
                        : appt.appointmentStatus === "Completed"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                >
                    {appt.appointmentStatus}
                </p>
                <p className="text-gray-700">
                    {appt.reasonForVisit || "N/A"}
                    {appt.isEmergency && appt.appointmentStatus !== "Scheduled" && (
                        <span className="font-semibold text-red-500 animate-pulse"> (Emergency)</span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AppointmentCard;
