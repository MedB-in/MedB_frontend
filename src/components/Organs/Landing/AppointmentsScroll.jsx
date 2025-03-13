import React, { useRef, useEffect } from "react";
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
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const x = e.clientX - startX.current;
            const scrollSpeed = 1.5;
            scrollRef.current.scrollLeft = scrollLeft.current - x * scrollSpeed;
        };

        const stopDragging = () => {
            isDragging.current = false;
            document.body.style.userSelect = "auto";
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopDragging);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDragging);
        };
    }, []);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
        scrollLeft.current = scrollRef.current.scrollLeft;
        document.body.style.userSelect = "none";
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-12 md:px-12 text-center overflow-hidden"
        >
            <motion.div
                ref={scrollRef}
                className="mt-8 flex gap-6 overflow-x-auto snap-x snap-mandatory 
                   scrollbar-hide cursor-grab active:cursor-grabbing px-4 scroll-smooth"
                onMouseDown={handleMouseDown}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ scrollPaddingLeft: "25%", scrollPaddingRight: "25%" }}
            >
                {appointments.map((appointment, index) => (
                    <section
                        key={index}
                        className="flex-shrink-0 snap-center w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] 
                   bg-gradient-to-l from-[#86cfc317] to-[#6f64e717] p-8 rounded-2xl 
                   flex flex-col justify-between shadow-md"
                    >
                        <div className="flex flex-col items-center text-center mb-6">
                            <h2 className="text-2xl font-bold">{appointment.title}</h2>
                            <p className="text-lg opacity-75">{appointment.subtitle}</p>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <p className="text-lg leading-relaxed md:w-2/3 text-center md:text-left">
                                {appointment.description}
                            </p>
                            <img
                                src={appointment.image}
                                alt="Appointments"
                                className="w-32 md:w-40 lg:w-64 object-contain pointer-events-none"
                            />
                        </div>
                    </section>
                ))}
            </motion.div>
        </motion.section>
    );
};

export default AppointmentsScroll;
