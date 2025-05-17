import React from "react";
import { motion } from "framer-motion";
import SectionImage1 from "../../../assets/images/healthcare/mdb_section_image1.png";
import SectionImage2 from "../../../assets/images/healthcare/mdb_section_image2.png";

const GetToKnow = () => {
    return (
        <div className="w-full py-10 px-4 md:px-10">
            {/* Get to Know Section */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center justify-center gap-10 mb-16 bg-white rounded-xl p-6 md:p-16 shadow-sm"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="w-full md:w-[50%] p-6"
                >
                    <img
                        src={SectionImage1}
                        alt="Illustration"
                        className="w-full h-auto"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="w-full md:w-[50%] p-6 text-left"
                >
                    <h5 className="text-[32px] md:text-[40px] font-semibold text-[#5a3fd8] mb-6 text-center md:text-left">
                        Get <span className="font-semibold">To Know</span>
                    </h5>
                    <ul className="list-none space-y-4 text-[18px] text-[#444] leading-relaxed">
                        <li>
                            <strong>Seamless Practice Management</strong> – Simplifies appointment scheduling, patient records, and consultations.
                        </li>
                        <li>
                            <strong>Enhanced Patient Engagement</strong> – Offers tools to improve communication and follow-ups with patients.
                        </li>
                        <li>
                            <strong>Digital Health Solutions</strong> – Enables telemedicine, e-prescriptions, and AI-driven diagnostics.
                        </li>
                        <li>
                            <strong>Streamlined Workflow</strong> – Reduces administrative tasks, allowing doctors to focus more on patient care.
                        </li>
                        <li>
                            <strong>Secure & Compliant</strong> – Ensures data security and compliance with healthcare regulations.
                        </li>
                        <li>
                            <strong>Professional Growth</strong> – Provides access to medical insights, peer networking, and continuous learning.
                        </li>
                        <li>
                            <strong>Scalable for All Practices</strong> – Perfect for individual practitioners, clinics, and large hospitals.
                        </li>
                    </ul>
                </motion.div>
            </motion.div>

            {/* MedB Section */}
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center justify-center gap-10 bg-white rounded-xl p-6 md:p-10"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="w-full md:w-[44vw] p-6"
                >
                    <img
                        src={SectionImage2}
                        alt="MedB Screenshot"
                        className="w-full h-auto"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                    className="w-full md:flex-1 text-left p-6"
                >
                    <h4 className="text-[24px] md:text-[31px] font-medium text-[#222] leading-relaxed">
                        <span className="text-[#5a3fd8] font-extrabold">MedB</span> – Your virtual assistant for appointment management. Spend less time scheduling, more time healing.
                    </h4>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default GetToKnow;
