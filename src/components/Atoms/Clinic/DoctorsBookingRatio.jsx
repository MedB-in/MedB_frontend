import { useState } from "react";
import TokenCard from "./TokenCard";

const DoctorsBookingRatio = ({ doctorRatios = [], modal = false, todaySlots }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="relative bg-[rgba(210,236,234,0.3)] p-4 sm:p-6 rounded-2xl max-w-full">
            <h2 className="text-sm mb-5 text-center">Doctor's Booking Ratio (Weekly)</h2>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex flex-col justify-between pr-2 text-[10px] text-gray-600 h-[200px] shrink-0">
                    {[45, 40, 35, 30, 25, 20, 15, 10, 5, 0].map((val) => (
                        <div key={val} className="h-[25px] flex items-center justify-end pr-1">
                            {val}
                        </div>
                    ))}
                </div>

                <div className="flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <div className="flex items-end h-[200px] space-x-3 min-w-[400px]">
                        {doctorRatios.map((data, index) => (
                            <div key={index} className="flex flex-col items-center w-[50px]">
                                <div
                                    title={`Scheduled: ${data.scheduledForWeek}\nCompleted: ${data.completedInTheWeek}`}
                                    className="flex items-end space-x-[2px] h-[200px]"
                                >
                                    <div
                                        className="w-[10px] bg-[#6F64E7] rounded-t-md"
                                        style={{ height: `${data.scheduledForWeek}px` }}
                                    />
                                    <div
                                        className="w-[10px] bg-[#86CFC3] rounded-t-md"
                                        style={{ height: `${data.completedInTheWeek}px` }}
                                    />
                                </div>
                                <div
                                    className="text-[11px] mt-2 text-center max-w-[60px] capitalize truncate"
                                    title={data.doctorName}
                                >
                                    {data.doctorName.split(" ")[0]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-2 text-[11px] shrink-0">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#6F64E7] rounded-sm" />
                        <span>Scheduled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-[#86CFC3] rounded-sm" />
                        <span>Completed</span>
                    </div>
                </div>
            </div>

            {!modal && (
                <div
                    className="absolute right-4 bottom-2 text-xs text-blue-600 hover:underline cursor-pointer"
                    onClick={() => setModalOpen(true)}
                >
                    View More
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/30 backdrop-blur-sm p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-screen-2xl shadow-xl relative">
                        <button
                            onClick={() => setModalOpen(false)}
                            className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold mb-4 text-center">Doctor Booking Details</h2>
                        <div className="max-h-[80vh] w-full overflow-y-auto flex flex-col items-center gap-8">
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
