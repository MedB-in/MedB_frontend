import React from "react";
import { motion } from "framer-motion";
import ForDoc1 from "../../../assets/images/healthcare/for_doctor_1.png";
import ForDoc2 from "../../../assets/images/healthcare/for_doctor_2.png";
import ForDoc3 from "../../../assets/images/healthcare/for_doctor_3.png";
import ForDoc4 from "../../../assets/images/healthcare/for_doctor_4.png";
import BgForDoc from "../../../assets/images/healthcare/bg_for_for_doc.png";

const steps = [
    {
        title: "Waitlist Management :",
        description:
            "Efficiently manage waitlists and fill canceled slots quickly, ensuring no time is wasted and maximizing your clinic’s capacity.",
        image: ForDoc1,
    },
    {
        title: "Flexible Availability :",
        description:
            "Customize your schedule based on your preferences, block out time for breaks or meetings, and adjust your availability with ease.",
        image: ForDoc2,
    },
    {
        title: "Reduced Admin Work :",
        description:
            "Say goodbye to administrative tasks. Our app automates appointment reminders, reduces no-shows, and keeps your calendar organized.",
        image: ForDoc3,
    },
    {
        title: "Security and Privacy :",
        description:
            "We prioritize the security and privacy of your patient information.",
        image: ForDoc4,
    },
];

const EasySteps = () => {
    return (
        <div
            className="w-full py-10 px-4 lg:px-6 flex flex-col items-center relative bg-no-repeat bg-contain bg-center mt-24"
            style={{ backgroundImage: `url(${BgForDoc})` }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-[32px] md:text-[40px] lg:text-[48px] font-bold italic text-[#5a3fd8] mb-16 text-center leading-tight"
            >
                Easy Steps For Your Solution
            </motion.h2>

            <div className="flex flex-col gap-16 md:gap-24 relative w-full max-w-6xl">
                {steps.map((step, idx) => {
                    const isReversed = idx % 2 === 1;

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 60 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={`flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-10 p-6 relative ${isReversed ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            <div className="relative flex items-start gap-4 max-w-md px-4">
                                <div className="w-3 h-3 mt-2 rounded-full bg-[#5a3fd8] shrink-0" />
                                <div>
                                    <h3 className="text-lg lg:text-2xl font-semibold mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm lg:text-lg text-gray-700">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            <motion.img
                                src={step.image}
                                alt={step.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                viewport={{ once: true }}
                                className="w-[240px] md:w-[280px] lg:w-[320px] object-contain"
                            />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default EasySteps;
