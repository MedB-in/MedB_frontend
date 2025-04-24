const WeeklyBookingOverview = ({ bookingRatio = {} }) => {
    const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="relative bg-[rgba(210,236,234,0.3)] p-6 rounded-2xl">
            <h2 className="text-sm mb-5 text-center">Your Booking Overview (Weekly)</h2>
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
                <div className="flex-1">
                    <div className="flex justify-between items-end h-[200px]">
                        {daysOrder.map((day, index) => {
                            const count = bookingRatio[day] ?? 0;
                            const height = count * 4;

                            return (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="flex items-end space-x-[1px] h-[200px]">
                                        <div
                                            className="w-[20px] rounded-t-md bg-[#6F64E7] transition-all duration-300"
                                            style={{ height: `${height}px` }}
                                        />
                                    </div>
                                    <div className="text-[12px] mt-2">{day.slice(0, 3)}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklyBookingOverview;
