import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DefaultImage from "../../../assets/images/default-doctor.png";

const DoctorCard = ({
    doctor,
    days,
    clinicId,
    idClinic,
    selectedDays,
    menuRights,
    toggleSelectedDay,
    handleEditDoctor,
    handleDoctorClinicStatus,
    handleSlots,
}) => {
    const navigate = useNavigate();

    return (
        <div
            key={doctor.doctorId}
            className="p-6 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition duration-200 flex flex-col"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img
                        src={doctor.profilePicture || DefaultImage}
                        alt={doctor.doctorName}
                        className="w-16 h-16 rounded-full object-cover border"
                    />
                    <div>
                        <h3 className="text-lg font-semibold">
                            Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{doctor.speciality}</p>
                        <p className="text-gray-600">{doctor.qualifications}</p>
                    </div>
                </div>
                {(!idClinic || menuRights?.editAllowed) && (
                    <button
                        className="text-gray-500 hover:text-gray-700 transition"
                        onClick={() => handleEditDoctor(doctor.doctorId)}
                        title="Edit Doctor"
                    >
                        <Pencil size={25} />
                    </button>
                )}
            </div>

            <div className="flex gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.isActiveDoctor ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {doctor.isActiveDoctor ? "Doctor Available" : "Doctor Not Available"}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${doctor.isActiveDoctorClinic ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {doctor.isActiveDoctorClinic ? "Consultation Available" : "Consultation Not Available"}
                </span>
            </div>

            <div className="mt-4 text-sm text-gray-600 space-y-2 flex-grow">
                <p>👤 <span className="font-medium">Gender:</span> {doctor.gender}</p>
                <p>⏳ <span className="font-medium">Experience:</span> {doctor.experience} years</p>
                <p>📞 <span className="font-medium">Phone:</span> {doctor.phone}</p>
                <p>✉️ <span className="font-medium">Email:</span> {doctor.email}</p>
                <p>📝 <span className="font-medium">Registration:</span> {doctor.registration}</p>

                <div className="mt-4">
                    <h4 className="text-md font-semibold">🕒 Available Slots:</h4>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {days.map((day) => {
                            const hasSlots = doctor.slots.some((slot) => slot.day === day.id);
                            return (
                                <button
                                    key={day.id}
                                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all hover:scale-105 ${hasSlots ? "text-green-500" : "text-red-500"} ${selectedDays[doctor.doctorId] === day.id ? "scale-105 bg-slate-200 shadow-lg" : ""}`}
                                    title="Select Day"
                                    onClick={() => toggleSelectedDay(doctor.doctorId, day.id)}
                                >
                                    {day.label}
                                </button>
                            );
                        })}
                    </div>
                    {selectedDays[doctor.doctorId] !== undefined && (
                        <div className="mt-4">
                            <h5 className="text-md font-semibold text-gray-700">
                                {days.find((d) => d.id === selectedDays[doctor.doctorId])?.label}
                            </h5>
                            <ul className="text-gray-600 text-sm mt-2 space-y-1">
                                {doctor.slots
                                    .filter((slot) => slot.day === selectedDays[doctor.doctorId])
                                    .map((slot) => (
                                        <li key={slot.slotId} className="bg-gray-100 px-3 py-1 rounded-md text-md">
                                            {slot.timingFrom} - {slot.timingTo} ({slot.slotGap} min gap)
                                        </li>
                                    ))}
                            </ul>
                            {doctor.slots.filter((slot) => slot.day === selectedDays[doctor.doctorId]).length === 0 && (
                                <p className="text-gray-500 text-sm mt-2">No slots available for this day.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-5">
                <div className="space-x-2">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={doctor.isActiveDoctorClinic}
                        onChange={(e) => handleDoctorClinicStatus(doctor.doctorId, e.target.checked)}
                        className="form-checkbox"
                    />
                    <span>{doctor.isActiveDoctorClinic ? "Consultation Active" : "Consultation Inactive"}</span>
                </div>
                <div>
                    <span
                        className="text-gray-500 text-md underline hover:text-red-500 cursor-pointer"
                        onClick={() => navigate(`/doctors/leave-management/${doctor.doctorId}/${clinicId}`)}
                    >
                        Leave Management
                    </span>
                </div>
            </div>

            {(!idClinic || menuRights?.editAllowed) && (
                <button
                    className="w-full bg-blue-500 mt-2 text-white py-2 rounded-md hover:bg-blue-600 transition"
                    onClick={() => handleSlots(clinicId, doctor.doctorId)}
                >
                    Edit Slots
                </button>
            )}
        </div>
    );
};

export default DoctorCard;
