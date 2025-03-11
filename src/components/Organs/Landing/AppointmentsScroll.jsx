import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Group1 from "../../../assets/images/Group-1-scroll.png";
import Group2 from "../../../assets/images/Group-2-scroll.png";
import Group3 from "../../../assets/images/Group-3-scroll.png";

const appointments = [
    {
        title: "SIMPLIFY YOUR APPOINTMENTS",
        subtitle: "We Value Your Time",
        description: "Schedule your upcoming medical visit instantly with a simple click, from anywhere",
        image: Group1,
    },
    {
        title: "NO QUEUES, NO HASSLE",
        subtitle: "We Value Your Stress-Free Solution!",
        description: "'MedB' allows you to book your doctor's appointment seamlessly, avoiding long queues.",
        image: Group2,
    },
    {
        title: "FAMILY INTEGRATION",
        subtitle: "Always Take Care Of Your Family",
        description: "We prioritize the health and well-being of your family above all else.",
        image: Group3,
    }
];

const AppointmentsScroll = () => {
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        document.body.style.userSelect = "none";
    };

    const handleMouseLeave = () => stopDragging();
    const handleMouseUp = () => stopDragging();

    const stopDragging = () => {
        setIsDragging(false);
        document.body.style.userSelect = "auto";
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="py-12 px-6 md:px-16">
            <motion.div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory 
                    scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent cursor-grab active:cursor-grabbing pb-4"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {appointments.map((appointment, index) => (
                    <motion.section
                        key={index}
                        className="w-[70vw] md:w-[50vw] lg:w-[40vw] xl:w-[40vw] bg-gradient-to-l from-[#86cfc317] 
                        to-[#6f64e717] p-8 rounded-2xl flex flex-col justify-between flex-shrink-0 snap-start shadow-md"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <div className="flex flex-col items-center text-center mb-6">
                            <h2 className="text-2xl font-bold">{appointment.title}</h2>
                            <p className="text-lg opacity-75">{appointment.subtitle}</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <p className="text-lg leading-relaxed md:w-2/3 text-center md:text-left">{appointment.description}</p>
                            <motion.img
                                src={appointment.image}
                                alt="Appointments"
                                className="w-32 md:w-40 lg:w-64 object-contain pointer-events-none"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6 }}
                            />
                        </div>
                    </motion.section>

                ))}
            </motion.div>
        </div>
    );
};

export default AppointmentsScroll;
