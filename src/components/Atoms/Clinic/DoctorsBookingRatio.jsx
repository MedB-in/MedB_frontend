import { useState } from "react";
import TokenCard from "./TokenCard";

const DoctorsBookingRatio = ({ doctorRatios = [], modal = false, todaySlots }) => {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <div className="relative bg-[rgba(210,236,234,0.3)] max-w-2xl p-6 rounded-2xl">
            <h2 className="text-sm mb-5 text-center">Doctor's Booking Ratio</h2>

            <div className="flex">
                {/* Y-Axis */}
                <div className="flex flex-col justify-between pr-2 text-[10px] text-gray-600 h-[200px]">
                    {[45, 40, 35, 30, 25, 20, 15, 10, 5, 0].map((val) => (
                        <div key={val} className="h-[25px] flex items-center justify-end pr-1">
                            {val}
                        </div>
                    ))}
                </div>

                {/* Bars Section */}
                <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <div className="flex justify-start items-end h-[200px] space-x-3">
                        {doctorRatios.map((data, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="flex items-end space-x-[2px] h-[200px]">
                                    {/* Scheduled */}
                                    <div
                                        className="w-[10px] bg-[#6F64E7]"
                                        style={{ height: `${data.scheduled}px` }}
                                    />
                                    {/* Completed */}
                                    <div
                                        className="w-[10px] bg-[#86CFC3]"
                                        style={{ height: `${data.completed}px` }}
                                    />
                                </div>
                                <div
                                    className="text-[12px] mt-2 text-center max-w-[100px] capitalize truncate"
                                    title={data.doctorName}
                                >
                                    {data.doctorName.split(" ")[0]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="ml-6 flex flex-col justify-center space-y-2 text-[10px]">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-[#6F64E7] rounded-sm" />
                        <span>Scheduled</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-[#86CFC3] rounded-sm" />
                        <span>Completed</span>
                    </div>
                </div>

            </div>
            {!modal &&
                <div className="right-3 absolute bottom-2 ml-6 flex flex-col justify-centerspace-y-2 text-[10px] cursor-pointer" onClick={() => setModalOpen(true)}>
                    <div className="flex items-center space-x-1">
                        <span>View More</span>
                    </div>
                </div>
            }
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/30 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-screen-2xl shadow-xl relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-2 right-4 text-gray-500 hover:text-black"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Doctor Booking Details</h2>
                        <div className="max-h-[80vh] flex flex-col justify-center items-center overflow-y-auto">
                            <DoctorsBookingRatio doctorRatios={doctorRatios} modal={true} />
                            <TokenCard slots={todaySlots} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorsBookingRatio;
