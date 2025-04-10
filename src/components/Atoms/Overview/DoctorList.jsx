import { useNavigate } from "react-router-dom";

const DoctorsList = ({ doctors = [] }) => {

    const navigate = useNavigate();

    return (
        <div className="bg-white border p-6 rounded-lg my-5 max-h-[500px] shadow-lg border-solid border-[rgba(0,0,0,0.1)]">
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
                            onClick={() => navigate('/clinics/clinic-profile')}
                        >
                            <div>
                                <div className="text-base font-medium capitalize">Dr. {doctor.doctorName}</div>
                                <div className="text-xs text-[rgba(0,0,0,0.7)] capitalize">
                                    {doctor.speciality} - {doctor.qualifications}
                                </div>
                            </div>
                            <div className="space-y-1 text-[13px] text-white text-right">
                                <div className={`px-[17px] py-0.5 rounded-[3px] ${doctor.doctorIsActive ? "text-[#59D03B]" : "bg-[#FF1B0B]"}`}>
                                    {doctor.doctorIsActive ? "Available" : "Not Available"}
                                </div>
                                <div className={`px-[17px] py-0.5 rounded-[3px] ${doctor.doctorClinicIsActive ? "text-[#59D03B]" : "bg-[#FF1B0B]"}`}>
                                    {doctor.doctorClinicIsActive ? "Consultation Available" : "Consultation Not Available"}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-sm text-gray-500 mt-4">No doctors available.</div>
                )}
            </div>
        </div>
    );
};

export default DoctorsList;
