import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import testimonials from "../../../lib/userTestimonials";

const Testimonials = () => {
    const scrollRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 4;
        }
    }, []);

    useEffect(() => {
        const container = scrollRef.current;
        const singleWidth = container.scrollWidth / 2;

        const onScroll = () => {
            if (container.scrollLeft >= singleWidth) {
                container.scrollLeft = container.scrollLeft - singleWidth;
            } else if (container.scrollLeft <= 0) {
                container.scrollLeft = container.scrollLeft + singleWidth;
            }
        };

        const ref = scrollRef.current;
        ref.addEventListener("scroll", onScroll);

        return () => {
            ref.removeEventListener("scroll", onScroll);
        };
    }, []);

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

            setTimeout(() => {
                setIsManuallyScrolling(false);
            }, 800);
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
            className="bg-[#eef1ff] py-12 px-6 md:px-12 text-center"
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
                    User Testimonials
                </motion.h2>
            </div>
            <motion.div
                ref={scrollRef}
                className="mt-8 overflow-hidden p-4 group select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={(e) => {
                    isDragging.current = true;
                    startX.current = e.touches[0].clientX;
                    scrollLeft.current = scrollRef.current.scrollLeft;
                }}
                onTouchMove={(e) => {
                    if (!isDragging.current) return;
                    const x = e.touches[0].clientX - startX.current;
                    scrollRef.current.scrollLeft = scrollLeft.current - x;
                }}
                onTouchEnd={() => {
                    isDragging.current = false;
                    setTimeout(() => {
                        setIsManuallyScrolling(false);
                    }, 800);
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div
                    className={`flex gap-6 ${isManuallyScrolling ? "" : "animate-marquee group-hover:[animation-play-state:paused]"
                        }`}
                >
                    {[...testimonials, ...testimonials].map((testimonial, index) => (
                        <div
                            key={index}
                            className="min-w-[80%] sm:min-w-[60%] md:min-w-[40%] lg:min-w-[30%] max-w-xs h-[480px] 
                bg-gradient-to-b from-[#D2ECEA] via-white to-[#6F64E7] p-6 rounded-2xl 
                flex flex-col justify-between items-center text-white snap-start cursor-grab active:cursor-grabbing"
                        >
                            <p className="text-black mt-14 md:text-lg font-light leading-relaxed">
                                "{testimonial.text}"
                            </p>
                            <div className="flex flex-col items-center space-y-2">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-32 h-32 rounded-full border-4 object-cover border-white"
                                    draggable={false}
                                />
                                <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                                <span className="text-sm opacity-80">{testimonial.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.section>
    );
};

export default Testimonials;
