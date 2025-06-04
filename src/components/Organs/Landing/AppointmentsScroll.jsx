import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Group1 from "../../../assets/images/Group-1-scroll.png";
import Group2 from "../../../assets/images/Group-2-scroll.png";
import Group3 from "../../../assets/images/Group-3-scroll.png";

const appointments = [
    {
        title: "SIMPLIFY YOUR APPOINTMENTS",
        subtitle: "We Value Your Time",
        description: "Schedule your next medical visit instantly with a single click. Anytime, Anywhere.",
        image: Group1,
    },
    {
        title: "NO QUEUES, NO HASSLE",
        subtitle: "We Value Your Stress-Free Experience!",
        description: "'MedB' lets you book your doctor’s appointment seamlessly, No long queues.",
        image: Group2,
    },
    {
        title: "FAMILY INTEGRATION",
        subtitle: "Always Take Care of Your Family",
        description: "We prioritize your family’s health and well-being above all.",
        image: Group3,
    },
];

const AppointmentsScroll = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const isDragging = useRef(false);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % appointments.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + appointments.length) % appointments.length);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) {
            handleNext();
        } else if (touchEndX.current - touchStartX.current > 50) {
            handlePrev();
        }
    };

    // Mouse Drag Events (Desktop)
    const handleMouseDown = (e) => {
        isDragging.current = true;
        touchStartX.current = e.clientX;
        document.body.style.cursor = "grabbing";
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        touchEndX.current = e.clientX;
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        document.body.style.cursor = "default";
        if (touchStartX.current - touchEndX.current > 50) {
            handleNext();
        } else if (touchEndX.current - touchStartX.current > 50) {
            handlePrev();
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="py-12 px-6 md:px-16 text-center overflow-hidden"
        >
            <div className="hidden md:flex justify-center gap-6">
                {appointments.map((appointment, index) => (
                    <section
                        key={index}
                        className="w-full md:w-2/3 bg-gradient-to-l from-[#86cfc317] to-[#6f64e717] 
                        p-8 rounded-2xl flex flex-col justify-between shadow-md text-center transition-all 
                        duration-500 ease-in-out transform hover:scale-105"
                    >
                        <h2 className="text-2xl font-bold">{appointment.title}</h2>
                        <p className="text-lg opacity-75 capita">{appointment.subtitle}</p>
                        <p className="text-lg leading-relaxed capitalize">{appointment.description}</p>
                        <img
                            src={appointment.image}
                            alt="Appointments"
                            className="w-32 md:w-40 lg:w-64 object-contain pointer-events-none"
                        />
                    </section>
                ))}
            </div>

            <div
                className="md:hidden relative overflow-hidden cursor-grab active:cursor-grabbing"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ userSelect: "none" }}
            >
                <div
                    key={currentIndex}
                    className="w-full p-8 bg-gradient-to-l from-[#86cfc317] to-[#6f64e717] 
                    rounded-2xl flex flex-col justify-between shadow-md text-center"
                >
                    <h2 className="text-2xl font-bold">{appointments[currentIndex].title}</h2>
                    <p className="text-lg opacity-75">{appointments[currentIndex].subtitle}</p>
                    <p className="text-lg leading-relaxed">{appointments[currentIndex].description}</p>
                    <img
                        src={appointments[currentIndex].image}
                        alt="Appointments"
                        className="w-32 md:w-40 lg:w-64 object-contain pointer-events-none"
                    />
                </div>
                <div className="flex justify-center mt-4 gap-2">
                    {appointments.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full mb-2 transition-all duration-300 ${index === currentIndex ? "bg-[#573bff] scale-125" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default AppointmentsScroll;
