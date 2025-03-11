import { motion } from "framer-motion";
import aboutImage from "../../../assets/images/aboutUs.png";

const AboutUs = () => {
    return (
        <motion.section
            className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 py-12 bg-gradient-to-r from-white to-[#eef1ff]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <motion.div
                className="w-full flex justify-center md:w-auto"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
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
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3 }}
            >
                <h2 className="text-3xl md:text-4xl font-bold tracking-wide">
                    <span className="text-[#573bff]">ABOUT</span>{" "}
                    <span className="text-[#28c76f]">US</span>
                </h2>
                <p className="text-gray-700 text-lg md:text-xl font-light leading-relaxed tracking-wide">
                    MedB revolutionizes healthcare by integrating technology with
                    compassionate care. Our app connects patients and providers, making it
                    easy to manage appointments, access medical information, and maintain
                    health records. Join us to transform your healthcare experience.
                </p>
            </motion.div>
        </motion.section>
    );
};

export default AboutUs;
