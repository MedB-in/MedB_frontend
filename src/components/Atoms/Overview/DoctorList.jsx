import { useState } from "react";
import { X } from "lucide-react";

const DoctorsList = ({ doctors = [] }) => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const closeModal = () => setSelectedDoctor(null);

    return (
        <div className="bg-white border p-6 rounded-lg min-h-[460px] border-solid my-5 shadow-lg border-[rgba(0,0,0,0.1)]">
            <h2 className="text-[19px] font-bold mb-5">Doctors List</h2>

            <div className="bg-[#6F64E7] text-white flex justify-between mb-[15px] p-3 rounded-lg">
                <div>Doctors Name</div>
                <div>Status</div>
            </div>

            <div className="flex max-h-[290px] flex-col gap-[15px] overflow-y-auto pr-1">
                {Array.isArray(doctors) && doctors.length > 0 ? (
                    doctors.map((doctor, index) => (
                        <div
                            key={index}
                            className="flex items-center hover:bg-slate-100 cursor-pointer justify-between p-[15px] border-b border-[rgba(0,0,0,0.1)]"
                            onClick={() => setSelectedDoctor(doctor)}
                        >
                            <div>
                                <div className="text-base font-medium capitalize">Dr. {doctor.doctorName}</div>
                                <div className="text-xs text-[rgba(0,0,0,0.7)] capitalize">
                                    {doctor.speciality} - {doctor.qualifications}
                                </div>
                            </div>
                            {doctor.isOnLeave ?
                                (<div className="space-y-1 text-[13px] text-white text-right">
                                    <div className={`px-[17px] py-0.5 rounded-[3px] bg-[#FF1B0B]`}>
                                        On Leave
                                    </div>
                                </div>
                                ) : (
                                    <div className="space-y-1 text-[13px] text-white text-right">
                                        <div className={`px-[17px] py-0.5 rounded-[3px] ${doctor.doctorIsActive ? "text-[#59D03B]" : "bg-[#FF1B0B]"}`}>
                                            {doctor.doctorIsActive ? "Available" : "Not Available"}
                                        </div>
                                        <div className={`px-[17px] py-0.5 rounded-[3px] ${doctor.doctorClinicIsActive ? "text-[#59D03B]" : "bg-[#FF1B0B]"}`}>
                                            {doctor.doctorClinicIsActive ? "Consultation Available" : "Consultation Not Available"}
                                        </div>
                                    </div>
                                )}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-sm text-gray-500 mt-4">No doctors available.</div>
                )}
            </div>

            {selectedDoctor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Dr. {selectedDoctor?.doctorName}
                            </h3>
                            <button onClick={closeModal}>
                                <X className="w-5 h-5 text-gray-600 hover:text-black" />
                            </button>
                        </div>

                        <div className="flex gap-4">
                            <img
                                src={selectedDoctor?.profilePicture}
                                alt={selectedDoctor?.doctorName}
                                className="w-24 h-24 rounded-lg object-cover"
                            />
                            <div className="text-sm text-gray-700 space-y-1">
                                <p><strong>Speciality:</strong> {selectedDoctor?.speciality}</p>
                                <p><strong>Qualifications:</strong> {selectedDoctor?.qualifications}</p>
                                <p><strong>Experience:</strong> {selectedDoctor?.experience} years</p>
                                <p><strong>Gender:</strong> {selectedDoctor?.gender}</p>
                                <p><strong>Email:</strong> {selectedDoctor?.email}</p>
                                <p><strong>Phone:</strong> {selectedDoctor?.phone}</p>
                                <p><strong>Registration:</strong> {selectedDoctor?.registration}</p>
                                <p><strong>Location:</strong> {selectedDoctor?.city}, {selectedDoctor?.district}, {selectedDoctor?.state}, {selectedDoctor?.country} - {selectedDoctor?.postalCode}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorsList;