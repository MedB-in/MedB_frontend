import { useRef, useEffect, useState } from "react";
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
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const handleMove = (clientX) => {
            if (!isDragging.current) return;
            const x = clientX - startX.current;
            const scrollSpeed = 1.5;
            scrollRef.current.scrollLeft = scrollLeft.current - x * scrollSpeed;
        };

        const handleMouseMove = (e) => handleMove(e.clientX);
        const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

        const stopDragging = () => {
            isDragging.current = false;
            document.body.style.userSelect = "auto";
            snapToClosestSlide();
        };

        const handleScroll = () => {
            const scrollX = scrollRef.current.scrollLeft;
            const sectionWidth = scrollRef.current.clientWidth;
            setCurrentIndex(Math.round(scrollX / sectionWidth));
        };

        const snapToClosestSlide = () => {
            const sectionWidth = scrollRef.current.clientWidth;
            const closestIndex = Math.round(scrollRef.current.scrollLeft / sectionWidth);
            scrollRef.current.scrollTo({ left: closestIndex * sectionWidth, behavior: "smooth" });
        };

        scrollRef.current.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopDragging);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", stopDragging);

        return () => {
            if (scrollRef.current) {
                scrollRef.current.removeEventListener("scroll", handleScroll);
            }
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDragging);
            window.removeEventListener("touchmove", handleTouchMove);
            window.removeEventListener("touchend", stopDragging);
        };

    }, []);

    const handleStart = (clientX) => {
        isDragging.current = true;
        startX.current = clientX;
        scrollLeft.current = scrollRef.current.scrollLeft;
        document.body.style.userSelect = "none";
    };

    const handleMouseDown = (e) => handleStart(e.clientX);
    const handleTouchStart = (e) => handleStart(e.touches[0].clientX);

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
                className="md:mt-4 flex gap-6 overflow-x-auto snap-x snap-mandatory 
                   scrollbar-hide cursor-grab active:cursor-grabbing px-4 scroll-smooth"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ scrollSnapType: "x mandatory" }}
            >
                {appointments.map((appointment, index) => (
                    <section
                        key={index}
                        className="flex-shrink-0 snap-center w-full sm:w-[80%] md:w-[60%] lg:w-[40%] 
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
            <div className="md:hidden flex justify-center mt-4 gap-2">
                {appointments.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollRef.current.scrollTo({
                            left: index * scrollRef.current.clientWidth,
                            behavior: "smooth",
                        })}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-[#573bff] scale-125" : "bg-gray-300"}`}
                    />
                ))}
            </div>
        </motion.section>
    );
};

export default AppointmentsScroll;
