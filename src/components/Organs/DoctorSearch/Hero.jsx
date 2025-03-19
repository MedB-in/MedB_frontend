import { motion } from "framer-motion";
import doctorImage from "../../../assets/images/doctor-search.png";

const HeroSection = () => {
    return (
        <section className="flex flex-col md:flex-row items-center p-6 md:p-12 bg-gradient-to-br from-indigo-100 to-white">
            <motion.div
                className="md:w-1/2 text-center md:text-left pt-10"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-400 bg-clip-text text-transparent p-6">
                    Welcome to Your Path to Wellness, Your Trusted Guide in the World of Health and Healing!
                </h2>
            </motion.div>
            <motion.div
                className="w-full md:w-1/2 flex justify-center items-center pt-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
                <div className="p-4 rounded-lg flex justify-center">
                    <img src={doctorImage} alt="Doctor" className="w-3/4 md:w-full" />
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
