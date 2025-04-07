import { motion } from "framer-motion";
import doctorImage from "../../../assets/images/doctor-search.png";
import SearchSection from "./Search";

const HeroSection = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const isClinicBooking = !!userDetails?.clinicId;
    const isDoctorBooking = !!userDetails?.doctorId;

    return (
        <section className="min-h-screen flex flex-col justify-between p-6 md:p-12 bg-gradient-to-br from-indigo-100 to-white">
            <div className="flex flex-col pt-16 md:flex-row items-center justify-center flex-grow">
                <motion.div
                    className="md:w-1/2 text-center md:text-left flex flex-col justify-center h-full"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-md md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-400 bg-clip-text text-transparent p-6">
                        Welcome to Your Path to Wellness, Your Trusted Guide in the World of Health and Healing!
                    </h2>
                </motion.div>
                <motion.div
                    className="w-full md:w-1/2 flex justify-center items-center h-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                    <div className="p-4 rounded-lg flex justify-center">
                        <img src={doctorImage} alt="Doctor" className="w-3/4 md:w-full max-h-[80vh] object-contain" />
                    </div>
                </motion.div>
            </div>
            <div className="w-full">
                {!isClinicBooking && !isDoctorBooking && (
                    <SearchSection />
                )}
            </div>
        </section>
    );
};

export default HeroSection;
