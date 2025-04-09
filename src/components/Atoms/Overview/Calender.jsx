
export const Calendar = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dates = Array.from({ length: 28 }, (_, i) => i + 1);

    return (
        <div className="bg-white border p-6 rounded-lg mt-5 shadow-lg border-solid border-[rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-5">
                <div className="text-sm font-bold text-[#6F64E7] uppercase">
                    january 2024
                </div>
                <div className="flex gap-2.5">
                    <button aria-label="Previous month">
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M14.8799 17.9717L9.37988 12.4717L14.8799 6.97168"
                                stroke="#000D26"
                                strokeOpacity="0.6"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button aria-label="Next month">
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 25 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M9.66919 6.97168L15.1692 12.4717L9.66919 17.9717"
                                stroke="#000D26"
                                strokeOpacity="0.6"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-[5px] text-[11px] mb-[15px]">
                {days.map((day) => (
                    <div key={day} className="text-center">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-[5px]">
                {dates.map((date) => (
                    <div
                        key={date}
                        className="w-8 h-8 border rounded-[40px] border-solid border-[#86CFC3] flex items-center justify-center text-sm"
                    >
                        {date}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar