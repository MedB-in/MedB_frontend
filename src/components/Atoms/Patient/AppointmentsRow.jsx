import { formatTime } from '../../../utils/format';
import ProfileAvatar from '../ProfileAvatar';

const AppointmentRow = ({ appt, isDoctor, today, handleOpenModal, handleAppointmentModal }) => {

    return (
        <tr
            key={appt.appointmentId}
            className={`${appt.index % 2 === 0 ? 'bg-[#f0f0ff]' : 'bg-white'} ${isDoctor ? 'cursor-pointer hover:bg-gray-100' : ''}`}
            onClick={isDoctor ? () => handleOpenModal(appt) : undefined}
        >
            {!isDoctor ? (
                <td className="px-4 py-3 text-left rounded-l-lg">
                    <div className="flex justify-start">
                        <div className="flex items-center justify-start gap-4">
                            <ProfileAvatar imageUrl={appt.profilePicture} name={appt.firstName} size="w-12 h-12" />
                            <div className="flex flex-col">
                                <p className="text-lg font-semibold">
                                    {appt?.firstName} {appt.middleName || ""} {appt.lastName || ""}
                                </p>
                                <p className="text-sm text-gray-600">{appt.doctorGender}</p>
                                <p className="text-sm text-gray-600">{appt.speciality}</p>
                                <p className="text-sm text-gray-600">{appt.experience} years of experience</p>
                                <p className="text-sm text-gray-600">{appt.qualifications}</p>
                            </div>
                        </div>
                    </div>
                </td>
            ) : (
                <td className="px-4 py-3 text-left rounded-l-lg">
                    <div className="flex justify-start">
                        <div className="flex items-center justify-start gap-4">
                            <ProfileAvatar imageUrl={appt.patientDetails?.profilePicture} name={appt.patientDetails?.firstName} size="w-12 h-12" />
                            <div className="flex-1">
                                <p className="text-lg font-semibold">
                                    {appt.patientDetails?.firstName} {appt.patientDetails?.middleName || ""} {appt.patientDetails?.lastName || ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </td>
            )}

            <td className="px-4 py-3 text-center">{appt.appointmentDate}</td>
            <td className="px-4 py-3 text-center"> {formatTime(appt.appointmentTime)}</td>

            <td className="px-4 py-3">
                <div className="flex justify-start">
                    <div className="flex items-center justify-start gap-4">
                        <ProfileAvatar imageUrl={appt.clinicPicture} name={appt.clinicName} size="w-12 h-12" />
                        <div className="flex flex-col">
                            <p className="text-lg font-semibold">{appt.clinicName}</p>
                            <p className="text-sm text-gray-600">{appt.address}</p>
                            <p className="text-sm text-gray-600 break-words max-w-full">{appt.email}</p>
                            <p className="text-sm text-gray-600">{appt.contact}</p>
                        </div>
                    </div>
                </div>
            </td>
            <td
                className={`px-4 py-3 font-semibold text-center ${appt.appointmentStatus === "Scheduled"
                    ? "text-blue-600"
                    : appt.appointmentStatus === "Completed"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
            >
                {appt.appointmentStatus}
                {appt.appointmentStatus === "Cancelled" && (
                    <div className="text-sm font-normal text-gray-500 mt-1">
                        <span className="italic">{appt.cancellationReason}</span>
                    </div>
                )}
            </td>

            <td
                className={`px-4 py-3 text-center capitalize rounded-r-lg ${appt.isEmergency && appt.appointmentStatus === "Scheduled" && isDoctor ? "bg-red-500 text-white animate-pulse font-bold" : ""
                    }`}
            >
                {appt.reasonForVisit || "N/A"}<br />
                {appt.isEmergency && " (Emergency)"}
            </td>

            {!isDoctor && appt.appointmentDate.split("-").reverse().join("-") >= today && appt.appointmentStatus === "Scheduled" ? (
                <td className="px-4 py-3 text-center">
                    <button
                        className="hover:bg-gray-200 bg-gray-100 text-indigo-400 font-semibold py-2 px-4 rounded-full"
                        onClick={() => handleAppointmentModal(appt)}
                    >
                        Cancel/Reschedule
                    </button>
                </td>
            ) : (
                <td className="px-4 py-3 text-center">-</td>
            )}
        </tr>
    )
};

export default AppointmentRow;