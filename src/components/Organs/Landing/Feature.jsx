import { useState, useEffect, useRef } from "react";
import HealthRecordsIcon from "../../../assets/images/h-records-feature.png";
import TokenBookingIcon from "../../../assets/images/token-feature.png";
import NearbyDoctorsIcon from "../../../assets/images/location-feature.png";

const features = [
    {
        title: "Health Records",
        description: "Keep Your Health Records, Prescriptions, And Test Results Well-Organized And Securely Accessible Through MedB.",
        image: HealthRecordsIcon,
        bgColor: "bg-[#D2ECEA]",
        borderRadius: "rounded-[0px_30px_0px_30px]",
        textColor: "text-gray-700",
    },
    {
        title: "Online Token Booking",
        description: "Skip the queues and book your next doctor's appointment with ease through our online token booking system.",
        image: TokenBookingIcon,
        bgColor: "bg-[#9289EC]",
        borderRadius: "rounded-[30px_0px_30px_0px]",
        textColor: "text-white",
    },
    {
        title: "Doctors And Clinics Near",
        description: "Discover Hospitals And Clinics Nearby With Ease Through A Quick And Simple Process.",
        image: NearbyDoctorsIcon,
        bgColor: "bg-[#D2ECEA]",
        borderRadius: "rounded-[0px_30px_0px_30px]",
        textColor: "text-gray-700",
    },
];

const FeatureSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            handleNext();
        } else if (touchEndX.current - touchStartX.current > 50) {
            handlePrev();
        }
    };

    return (
        <section className="py-12 px-6 md:px-16 cursor-default">
            <div className="flex justify-center text-center mb-8">
                <h2 className="text-2xl md:text-4xl font-medium tracking-wider">
                    "Bringing <span className="text-[#573bff] font-semibold">Healthcare</span> To Your Fingertips"
                </h2>
            </div>
            <div className="hidden md:flex flex-row justify-center gap-6">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`w-full md:w-1/3 h-[550px] md:h-[600px] p-8 ${feature.bgColor} ${feature.borderRadius} flex flex-col justify-between items-center text-center shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105`}
                    >
                        <div className="h-2/3 flex justify-center items-center w-full">
                            <img
                                src={feature.image}
                                alt={feature.title}
                                className="w-full max-w-[280px] h-auto max-h-72 md:max-h-96 object-contain transition-all duration-500 ease-in-out"
                            />
                        </div>
                        <div className="h-1/3 flex flex-col justify-center items-center">
                            <h3 className={`text-xl md:text-2xl font-semibold ${feature.textColor} mb-3`}>
                                {feature.title}
                            </h3>
                            <p className={`text-lg ${feature.textColor} opacity-80 w-4/5 md:w-3/4`}>
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="md:hidden relative overflow-hidden" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                <div
                    key={currentIndex}
                    className={`w-full h-[550px] p-8 ${features[currentIndex].bgColor} ${features[currentIndex].borderRadius} flex flex-col justify-between items-center text-center shadow-lg`}
                >
                    <div className="h-2/3 flex justify-center items-center w-full">
                        <img
                            src={features[currentIndex].image}
                            alt={features[currentIndex].title}
                            className="w-full max-w-[280px] h-auto max-h-72 object-contain transition-all duration-500 ease-in-out"
                        />
                    </div>
                    <div className="h-1/3 flex flex-col justify-center items-center">
                        <h3 className={`text-xl md:text-2xl font-semibold ${features[currentIndex].textColor} mb-3`}>
                            {features[currentIndex].title}
                        </h3>
                        <p className={`text-lg ${features[currentIndex].textColor} opacity-80 w-4/5 md:w-3/4`}>
                            {features[currentIndex].description}
                        </p>
                    </div>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                    {features.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full mb-2 transition-all duration-300 ${index === currentIndex ? "bg-[#573bff] scale-125" : "bg-gray-300"}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;