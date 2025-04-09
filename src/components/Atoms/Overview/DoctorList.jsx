import React from "react";

const DoctorsList = ({ doctors = [] }) => {
    return (
        <div className="bg-white border p-6 rounded-lg my-5 shadow-lg border-solid border-[rgba(0,0,0,0.1)]">
            <h2 className="text-[19px] font-bold mb-5">Doctors List</h2>

            <div className="bg-[#6F64E7] text-white flex justify-between mb-[15px] p-3 rounded-lg">
                <div>Doctors Name</div>
                <div>Status</div>
            </div>

            <div className="flex flex-col gap-[15px]">
                {Array.isArray(doctors) && doctors.length > 0 ? (
                    doctors.map((doctor, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-[15px] border-b border-[rgba(0,0,0,0.1)]"
                        >
                            <div>
                                <div className="text-base font-medium">{doctor.name}</div>
                                <div className="text-xs text-[rgba(0,0,0,0.7)]">{doctor.qualification}</div>
                            </div>
                            <div
                                className={`text-white text-[13px] px-[17px] py-0.5 rounded-[3px] ${doctor.available ? "bg-[#59D03B]" : "bg-[#FF1B0B]"
                                    }`}
                            >
                                {doctor.available ? "Available" : "Not Available"}
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
