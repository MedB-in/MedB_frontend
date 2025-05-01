import { motion } from "framer-motion";
import cubeIcon from "../../../assets/images/cube-icon.png";
import doctorAppointment from "../../../assets/images/aboutUs/doctorAppointment.png";
import mission from "../../../assets/images/aboutUs/mission.png";
import vision from "../../../assets/images/aboutUs/vision.png";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

const AboutUsMain = () => {
    return (
        <div className="bg-white py-16 pt-24 px-6">
            <div className="w-[90%] mx-auto py-12 space-y-24">
                <motion.div
                    className="flex flex-col md:flex-row items-center justify-between gap-8"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <motion.div
                        className="flex-1 text-center"
                        custom={1}
                        variants={fadeInUp}
                    >
                        <img
                            src={doctorAppointment}
                            alt="Doctor Appointment"
                            className="h-[50dvh] object-contain mx-auto"
                        />
                    </motion.div>

                    <motion.div
                        className="flex-1 text-center md:text-left"
                        custom={2}
                        variants={fadeInUp}
                    >
                        <h2 className="text-3xl md:text-4xl text-[#6F64E7] font-bold flex items-center gap-3 mb-8">
                            <img src={cubeIcon} alt="icon" className="w-8 h-8 mt-12 -mr-3" />
                            <span className="relative inline-block">
                                MedB
                                <span className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-gray-400"></span>
                            </span>
                        </h2>
                        <p className="text-[17px] text-gray-600 leading-relaxed font-light">
                            At MedB, we believe that managing your health should be simple, convenient, and stress-free. Our
                            innovative application is designed to streamline the healthcare experience for both patients and
                            healthcare facilities, ensuring communication and efficient management of medical records. With
                            MedB, patients can easily book appointments with their preferred doctors, access detailed profiles
                            and schedules of healthcare providers, and keep track of their medical records, prescriptions, and
                            history in one secure place. For clinics, MedB offers powerful tools to manage patient lists with
                            ease, maintain accurate and up-to-date accounts, and enhance patient satisfaction with efficient
                            appointment scheduling and record-keeping. Join the MedB community today and experience a smarter
                            way to manage your healthcare needs.
                        </p>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="text-center"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    custom={3}
                >
                    <motion.h2
                        className="text-3xl md:text-4xl text-[#6F64E7] font-bold flex justify-center items-center gap-3 mb-8"
                        custom={4}
                        variants={fadeInUp}
                    >
                        <img src={cubeIcon} alt="icon" className="w-8 h-8 mt-12 -mr-3" />
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-[#6F64E7] to-[#6f64e7a6] bg-clip-text text-transparent">
                                Our Mission & Vision
                            </span>
                            <span className="absolute bottom-[-6px] left-0 w-full h-[2px] bg-gray-400"></span>
                        </span>
                    </motion.h2>

                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <motion.div
                            className="flex-1 bg-white/80 p-6 rounded-lg shadow text-left"
                            custom={5}
                            variants={fadeInUp}
                        >
                            <img
                                src={mission}
                                alt="Mission"
                                className="h-[40dvh] object-contain mx-auto mb-4"
                            />
                            <p className="text-[17px] text-gray-600 font-light leading-relaxed">
                                To simplify and empower the healthcare journey by providing a seamless digital platform that connects patients and clinics with ease, ensuring efficient appointment management, transparent communication, and secure health record access—all in one place.
                            </p>
                        </motion.div>

                        <motion.div
                            className="flex-1 bg-white/80 p-6 rounded-lg shadow text-left"
                            custom={6}
                            variants={fadeInUp}
                        >
                            <p className="text-[17px] text-gray-600 font-light leading-relaxed mb-4">
                                To become the most trusted and intelligent healthcare ecosystem in India, where technology bridges the gap between patients and providers, promoting better health outcomes and accessible care for all.
                            </p>
                            <img
                                src={vision}
                                alt="Vision"
                                className="h-[40dvh] object-contain mx-auto"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AboutUsMain;