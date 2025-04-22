const TokenCard = ({ slots }) => {
    return (
        <section className="token-dashboard py-6">
            <div className="max-w-screen-2xl mx-auto p-4">
                <h2 className="font-bold text-2xl text-center mb-6">Total Slots Availability for Today</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {slots.map((slot, index) => (
                        <div key={index} className="w-[200px] min-h-[140px] bg-gradient-to-r from-[#00D1C1] to-[#00B0A2] rounded-xl shadow-lg p-4 flex flex-col justify-between items-center">
                            <div className="w-full text-center text-white">
                                <h3 className="font-bold text-lg capitalize">Dr. {slot.doctorName}</h3>
                                <p className="font-normal text-sm">{slot.qualification}</p>
                            </div>
                            <div className="flex w-full justify-center mt-4 bg-gray-600 p-2 rounded-lg">
                                <div className="flex flex-col items-center">
                                    <p className="text-white text-sm">Available</p>
                                    <p className="text-white font-bold text-xl">{slot.todaySlots}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TokenCard;
