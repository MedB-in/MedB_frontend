import { formatTime } from "../../../utils/format";
import BookingName from "../../Atoms/Appointments/BookingName";
import ProfileAvatar from "../../Atoms/ProfileAvatar";
const AppointmentTable = ({ appointments, loading, handleStatus, handleToken, today }) => {

    return (
        <table className="w-full table-auto border-collapse text-sm">
            <thead>
                <tr className="bg-white/50 backdrop-blur-lg text-gray-800 text-center">
                    {["No.", "Doctor", "Appointment Date", "Appointment Time", "Patient", "Status", "Visit Reason", "Actions"].map(
                        (header, index) => (
                            <th key={index} className="px-4 py-3 border-b border-gray-300">
                                {header}
                            </th>
                        )
                    )}
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="8" className="px-4 py-6 text-center text-gray-600 text-lg">
                            Loading...
                        </td>
                    </tr>
                ) : (
                    <>
                        {appointments.length ? (
                            appointments.map((appt, index) => (
                                <tr
                                    key={index}
                                    className="bg-white/30 backdrop-blur-md border border-gray-200 odd:bg-white/20 hover:bg-white/40 transition-all"
                                >
                                    <td className="px-4 py-3 text-center">{index + 1}</td>
                                    <td className="px-4 py-3 min-w-[200px] whitespace-normal break-words">
                                        <div className="flex justify-start">
                                            <div className="flex items-center justify-start gap-4">
                                                <ProfileAvatar imageUrl={appt.doctorProfilePicture} name={appt.doctorFirstName} />
                                                <div className="text-left">
                                                    <p className="text-lg font-semibold text-gray-800">
                                                        {appt.doctorFirstName} {appt.doctorMiddleName || ""} {appt.doctorLastName || ""}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{appt.doctorGender}</p>
                                                    <p className="text-sm text-gray-600">{appt.speciality}</p>
                                                    <p className="text-sm text-gray-600">{appt.experience} years of experience</p>
                                                    <p className="text-sm text-gray-600">{appt.qualifications}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">{appt.appointmentDate}</td>
                                    <td className="px-4 py-3 text-center">{formatTime(appt.appointmentTime)}</td>
                                    <td className="px-4 py-3 min-w-[200px] whitespace-normal break-words">
                                        <div className="flex justify-start">
                                            <div className="flex items-center justify-start gap-4">
                                                <ProfileAvatar imageUrl={appt.patientProfilePicture} name={appt.patientFirstName} />
                                                <div className="text-left">
                                                    <BookingName
                                                        bookFor={appt.bookFor}
                                                        patientFirstName={appt.patientFirstName}
                                                        patientMiddleName={appt.patientMiddleName}
                                                        patientLastName={appt.patientLastName}
                                                    />
                                                    <p className="text-sm text-gray-600 break-all w-full overflow-hidden">{appt.patientEmail}</p>
                                                    <p className="text-sm text-gray-600">{appt.patientContactNo}</p>
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
                                        {appt.appointmentStatus}<br />
                                        {appt.appointmentStatus === "Cancelled" && "Reason: " + appt.cancellationReason}
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-center capitalize ${appt.isEmergency &&
                                            appt.appointmentStatus === "Scheduled" &&
                                            today === appt.appointmentDate.split("-").reverse().join("-")
                                            ? "bg-red-500 text-white animate-pulse font-bold"
                                            : ""
                                            }`}
                                    >
                                        {appt.reasonForVisit || "N/A"}<br />
                                        {appt.isEmergency && " (Emergency)"}<br />
                                    </td>
                                    {appt.appointmentStatus === "Scheduled" &&
                                        appt.appointmentDate.split("-").reverse().join("-") >= today ? (
                                        <td className="flex flex-col gap-2 p-2 items-center">
                                            <button
                                                onClick={() => handleStatus(appt)}
                                                className="px-4 py-2 bg-blue-500/80 backdrop-blur-md border border-blue-500 shadow-lg shadow-blue-500/20 hover:bg-blue-500/50 text-white rounded-lg transition-all duration-300"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleToken(appt)}
                                                className="px-4 py-2 bg-red-500/80 backdrop-blur-md border border-red-500 shadow-lg shadow-red-500/20 hover:bg-red-500/50 text-white rounded-lg transition-all duration-300"
                                            >
                                                Assign Token
                                            </button>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="flex flex-col gap-2 p-2 items-center">-</td>
                                            <td className="flex flex-col gap-2 p-2 items-center">-</td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="px-4 py-3 text-center">
                                    No appointments found
                                </td>
                            </tr>
                        )}
                    </>
                )}
            </tbody>
        </table>
    );
};

export default AppointmentTable;
