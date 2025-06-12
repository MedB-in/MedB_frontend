import { useEffect, useState } from "react";
import { formatTime } from '../../../utils/format';
import ProfileAvatar from '../ProfileAvatar';

const AppointmentCard = ({ appt, isDoctor, page, today, handleOpenModal, handleAppointmentModal }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const status = appt.appointmentStatus;
    const isCollapsedView = ['Cancelled', 'Rescheduled', 'Expired'].includes(status) && !isExpanded;

    useEffect(() => {

        setIsExpanded(false);
    }, [page]);

    const handleClick = () => {
        if (isCollapsedView) {
            setIsExpanded(true);
        } else {
            if (isDoctor) {
                handleOpenModal(appt);
            } else {
                const formattedDate = appt.appointmentDate.split("-").reverse().join("-");
                if (formattedDate >= today && status === "Scheduled") {
                    handleAppointmentModal(appt);
                }
            }
        }
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 flex flex-col gap-4 transform transition-all duration-300 ease-in-out hover:bg-gray-200 hover:shadow-xl cursor-pointer"
        >
            {isCollapsedView ? (
                <div className="text-sm text-left">
                    <p className={`font-semibold ${status === "Cancelled"
                        ? "text-red-500"
                        : status === "Rescheduled"
                            ? "text-yellow-700"
                            : "text-yellow-500"
                        }`}>
                        {status} Appointment ({formatTime(appt.appointmentTime)} - {appt.appointmentDate} )
                    </p>

                    <p className="text-xs mt-1 text-indigo-500 underline">
                        Tap to view more
                    </p>
                </div>
            ) : (<>
                <div className="flex items-center text-left gap-4 border-b pb-3">
                    <ProfileAvatar
                        imageUrl={isDoctor ? appt.patientDetails.profilePicture : appt.profilePicture}
                        name={isDoctor ? appt.patientDetails.firstName : appt.firstName}
                    />
                    <div>
                        <p className="text-lg font-semibold">
                            {isDoctor
                                ? `${appt.patientDetails.firstName} ${appt.patientDetails.middleName || ''} ${appt.patientDetails.lastName || ''}`
                                : `${appt.firstName} ${appt.lastName || ''}`}
                        </p>
                        {!isDoctor && !isCollapsedView && (
                            <p className="text-sm text-gray-600">{appt.speciality}</p>
                        )}
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
                    <p className={`font-semibold ${status === "Scheduled"
                        ? "text-blue-600"
                        : status === "Completed"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}>
                        {status}
                    </p>

                    <p className="text-gray-700 col-span-2">
                        {appt.reasonForVisit || "N/A"}
                        {appt.isEmergency && status !== "Scheduled" && (
                            <span className="font-semibold text-red-500 animate-pulse"> (Emergency)</span>
                        )}
                    </p>
                </div>
            </>
            )}
        </div>
    );
};

export default AppointmentCard;
