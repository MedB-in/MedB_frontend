import { motion } from "framer-motion";
import aboutImage from "../../../assets/images/aboutUs.png";

const AboutUs = () => {
    return (
        <motion.section
            className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-12 bg-gradient-to-r from-white to-[#eef1ff]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.div
                className="w-full flex justify-center md:w-auto"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <img
                    src={aboutImage}
                    alt="About Us"
                    className="w-full max-w-[300px] md:max-w-[90%]"
                />
            </motion.div>
            <motion.div
                className="text-left md:text-left space-y-4 md:max-w-[50%]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-[#573bff] to-[#86CFC3] bg-clip-text text-transparent w-fit">
                    ABOUT US
                </h2>
                <p className="text-gray-700 text-lg md:text-xl font-light leading-relaxed tracking-wide">
                    MedB revolutionizes healthcare by seamlessly integrating technology with compassionate care. Our app connects patients and providers, making it simple to manage appointments, access medical information, and maintain health records. Join us in transforming your healthcare experience.
                </p>
            </motion.div>
        </motion.section>
    );
};

export default AboutUs;
