import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import topLeft from "../../../assets/images/doctor-testimonials/top-left.svg";
import bottomRight from "../../../assets/images/doctor-testimonials/bottom-right.svg";
import quotesTop from "../../../assets/images/doctor-testimonials/quotes-top.svg";
import quotesBottom from "../../../assets/images/doctor-testimonials/quotes-bottom.svg";
import QuoteImage from "../../Atoms/Landingpage/QuoteImage";
import testimonials from "../../../lib/doctorTestimonials";

const TestimonialSection = () => {
    const scrollRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);

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
            setTimeout(() => setIsManuallyScrolling(false), 800);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopDragging);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopDragging);
        };
    }, []);

    useEffect(() => {
        const container = scrollRef.current;
        const singleWidth = container.scrollWidth / 2;

        const onScroll = () => {
            if (container.scrollLeft >= singleWidth) {
                container.scrollLeft -= singleWidth;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft += singleWidth;
            }
        };

        container.addEventListener("scroll", onScroll);

        return () => container.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 4;
        }
    }, []);

    const handleMouseDown = (e) => {
        isDragging.current = true;
        setIsManuallyScrolling(true);
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
            className="py-12 px-6 md:px-12 text-center bg-[#D2ECEA] relative"
        >
            <div className="flex justify-center">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-bold tracking-wide 
                               bg-gradient-to-r from-[#573bff] to-[#86CFC3] 
                               bg-clip-text text-transparent w-fit"
                >
                    Doctor's Testimonials
                </motion.h2>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                ref={scrollRef}
                className="mt-8 overflow-hidden p-4 group select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={(e) => {
                    isDragging.current = true;
                    startX.current = e.touches[0].clientX;
                    scrollLeft.current = scrollRef.current.scrollLeft;
                    setIsManuallyScrolling(true);
                }}
                onTouchMove={(e) => {
                    if (!isDragging.current) return;
                    const x = e.touches[0].clientX - startX.current;
                    scrollRef.current.scrollLeft = scrollLeft.current - x;
                }}
                onTouchEnd={() => {
                    isDragging.current = false;
                    setTimeout(() => setIsManuallyScrolling(false), 800);
                }}
            >
                <div
                    className={`flex gap-6 ${isManuallyScrolling ? "" : "animate-marquee group-hover:[animation-play-state:paused]"}`}
                >
                    {[...testimonials, ...testimonials].map(({ quote, doctorName, credentials, image }, index) => (
                        <article
                            key={index}
                            className="relative flex flex-col items-center bg-white rounded-3xl p-8 shadow-md min-w-[320px] max-w-[400px] snap-start cursor-grab active:cursor-grabbing"
                        >
                            <QuoteImage
                                src={topLeft}
                                className="absolute top-0 left-0 w-[120px] md:w-[133px] pointer-events-none"
                                alt="Top left decoration"
                            />
                            <QuoteImage
                                src={image}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                                alt={`${doctorName} profile`}
                            />
                            <QuoteImage src={quotesTop} className="w-6 mt-3 self-start" alt="Top quotes" />
                            <blockquote className="mt-4 text-gray-700 text-lg italic text-center">
                                "{quote}"
                            </blockquote>
                            <QuoteImage src={quotesBottom} className="w-6 mt-3 self-end" alt="Bottom quotes" />
                            <div className="mt-4 text-center">
                                <h3 className="text-xl font-bold">{doctorName}</h3>
                                <p className="text-gray-500">{credentials}</p>
                            </div>
                            <QuoteImage
                                src={bottomRight}
                                className="absolute bottom-0 right-0 w-[100px] md:w-[134px] z-0"
                                alt="Bottom right decoration"
                            />
                        </article>
                    ))}
                </div>
            </motion.div>
        </motion.section>
    );
};

export default TestimonialSection;