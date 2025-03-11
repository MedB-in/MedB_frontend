import { motion } from "framer-motion";
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
    return (
        <section className="py-12 px-6 md:px-16 cursor-default">
            <div className="flex justify-center text-center mb-8">
                <h2 className="text-2xl md:text-4xl font-medium tracking-wider">
                    "Bringing <span className="text-[#573bff] font-semibold">Healthcare</span> To Your Fingertips"
                </h2>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-6">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        className={`w-full md:w-1/3 h-[550px] md:h-[600px] p-8 ${feature.bgColor} ${feature.borderRadius} flex flex-col justify-between items-center text-center shadow-lg transition-all duration-500 ease-in-out transform hover:scale-105`}
                    >
                        {index === 1 ? (
                            <>
                                <div className="h-1/3 flex flex-col justify-center items-center">
                                    <h3 className={`text-xl md:text-2xl font-semibold ${feature.textColor} mb-3`}>
                                        {feature.title}
                                    </h3>
                                    <p className={`text-sm md:text-base ${feature.textColor} opacity-80 w-4/5 md:w-3/4`}>
                                        {feature.description}
                                    </p>
                                </div>
                                <div className="h-2/3 flex justify-center items-center w-full">
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full max-w-[280px] h-auto max-h-72 md:max-h-96 object-contain transition-all duration-500 ease-in-out"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
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
                                    <p className={`text-sm md:text-base ${feature.textColor} opacity-80 w-4/5 md:w-3/4`}>
                                        {feature.description}
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FeatureSection;
