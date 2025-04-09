

export const PatientFeedback = ({ feedbacks = [] }) => {
    return (
        <div className="bg-white border p-6 my-5 shadow-lg rounded-lg border-solid border-[rgba(0,0,0,0.1)]">
            <div className="bg-[#6F64E7] text-white text-center mb-5 p-3 rounded-lg">
                Patient feedback
            </div>
            <div className="flex flex-col gap-[15px]">
                {feedbacks.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white flex gap-[15px] items-start p-[15px] rounded-lg"
                    >
                        <img
                            src={item.image}
                            alt=""
                            className="w-[45px] h-[45px] rounded-full"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-[5px]">
                                <div className="text-base font-medium">{item.name}</div>
                                <div className="flex gap-[5px]">
                                    {Array.from({ length: item.rating }).map((_, i) => (
                                        <svg
                                            key={i}
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="#FFD700"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M10 1l2.5 5 5.5.5-4 4 1 5.5-5-3-5 3 1-5.5-4-4 5.5-.5z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <div className="text-xs text-[rgba(0,0,0,0.5)]">
                                {item.feedback}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PatientFeedback