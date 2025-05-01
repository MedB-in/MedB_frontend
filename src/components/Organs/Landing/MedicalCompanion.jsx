import { motion } from "framer-motion";
import companion from "../../../assets/images/companion.png";

const MedicalCompanion = () => {
    return (
        <motion.section
            className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-12 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.div
                className="text-center md:text-left space-y-4 md:max-w-[50%]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
                    YOUR COMPLETE <span className="text-[#573bff]">MEDICAL</span> COMPANION
                </h2>
                <p className="text-gray-700 text-base sm:text-lg md:text-xl font-light leading-relaxed tracking-wide">
                    Experience the convenience of managing your health anytime, anywhere. Effortlessly book appointments, access medical records, and stay on top of your well-being with personalized health tools, all within the user-friendly MedB platform. Embrace a new era of accessible and proactive healthcare – MedB, where your health is always at your fingertips.
                </p>
            </motion.div>
            <motion.div
                className="w-full md:w-auto text-center md:text-right"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <img
                    src={companion}
                    alt="Medical Companion"
                    className="max-w-[80%] sm:max-w-[60%] md:max-w-[40dvw] mx-auto"
                />
            </motion.div>
        </motion.section>
    );
};

export default MedicalCompanion;
