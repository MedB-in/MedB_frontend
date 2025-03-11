import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import topLeft from "../../../assets/images/doctor-testimonials/top-left.svg";
import bottomRight from "../../../assets/images/doctor-testimonials/bottom-right.svg";
import quotesTop from "../../../assets/images/doctor-testimonials/quotes-top.svg";
import quotesBottom from "../../../assets/images/doctor-testimonials/quotes-bottom.svg";
import doctorImage from "../../../assets/images/doctor-testimonials/doctor-image.png";
import QuoteImage from "../../Atoms/Landingpage/QuoteImage";

const testimonials = [
    {
        quote:
            "The MedB platform is truly innovative, especially its online appointment feature, which has streamlined my practice. It's user-friendly and efficient, saving time for both me and my patients.",
        doctorName: "Dr. Sanin Haneef",
        credentials: "(MBBS)",
    },
    {
        quote:
            "MedB is revolutionizing healthcare accessibility with its online appointment system. It has not only improved my interaction with patients but also made managing schedules incredibly easy.",
        doctorName: "Dr. Shehanas",
        credentials: "(MBBS)",
    },
    {
        quote:
            "The convenience MedB offers through its online appointments is commendable. It allows me to focus on providing quality care rather than managing logistics.",
        doctorName: "Dr. Shas Hussain A P",
        credentials: "(BDS)",
    },
    {
        quote:
            "MedB has significantly improved my practice efficiency. The seamless appointment scheduling is a game-changer for both doctors and patients.",
        doctorName: "Dr. Aisha Khan",
        credentials: "(MD)",
    },
    {
        quote:
            "With MedB, my clinic operations have become much more organized. I appreciate the ease of use and the continuous improvements in the platform.",
        doctorName: "Dr. Rohan Patel",
        credentials: "(MBBS, MD)",
    },
    {
        quote:
            "MedB's innovative features have enhanced patient engagement. The online consultation system is extremely useful, and I highly recommend it to fellow doctors.",
        doctorName: "Dr. Meera Joshi",
        credentials: "(BDS)",
    },
];

const TestimonialSection = () => {
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
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }} className="py-12 px-6 md:px-12 text-center bg-[#D2ECEA] relative">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6 }} className="text-3xl md:text-4xl font-bold tracking-wide">
                <span className="text-[#573bff]">Doctor's</span>{" "}
                <span className="text-[#28c76f]">Testimonials</span>
            </motion.h2>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                ref={scrollRef}
                className="mt-8 flex gap-6 overflow-x-auto p-4 scrollbar-hide snap-x snap-mandatory 
                    cursor-grab active:cursor-grabbing scroll-smooth"
                onMouseDown={handleMouseDown}
            >
                {testimonials.map(({ quote, doctorName, credentials }, index) => (
                    <motion.article
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="relative flex flex-col items-center bg-white rounded-3xl p-8 shadow-md 
                           min-w-[320px] max-w-[400px] snap-start"
                    >
                        <QuoteImage
                            src={topLeft}
                            className="absolute top-0 left-0 w-[120px] md:w-[133px] pointer-events-none"
                            alt="Top left decoration"
                        />
                        <QuoteImage
                            src={doctorImage}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                            alt={`${doctorName} profile`}
                        />
                        <QuoteImage src={quotesTop} className="w-6 mt-3" alt="Top quotes" />
                        <blockquote className="mt-4 text-gray-700 text-lg italic">
                            "{quote}"
                        </blockquote>
                        <QuoteImage src={quotesBottom} className="w-6 mt-3" alt="Bottom quotes" />
                        <div className="mt-4">
                            <h3 className="text-xl font-bold">{doctorName}</h3>
                            <p className="text-gray-500">{credentials}</p>
                        </div>
                        <QuoteImage
                            src={bottomRight}
                            className="absolute bottom-0 right-0 w-[100px] md:w-[134px] z-0"
                            alt="Bottom right decoration"
                        />
                    </motion.article>
                ))}
            </motion.div>
        </motion.section>
    );
};

export default TestimonialSection;
