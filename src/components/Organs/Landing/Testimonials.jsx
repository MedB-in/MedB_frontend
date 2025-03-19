import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import aliceImage from "../../../assets/images/alice-testimonials.png";
import samuelImage from "../../../assets/images/samuel-testimonials.png";
import fahadImage from "../../../assets/images/fahad-testimonials.png";

const testimonials = [
    {
        text: "I'm not good with tech, but MedB is simple. Got my appointments sorted, and now my meds are all in one place.",
        name: "Alice",
        role: "Chief Accountant",
        image: aliceImage,
    },
    {
        text: "MedB transforms medical appointments, giving patients ease and convenience. A real game-changer for access to healthcare.",
        name: "Samuel",
        role: "Accountant",
        image: samuelImage,
    },
    {
        text: "MedB has revolutionized my healthcare routine. It’s like having a personal healthcare assistant always at my fingertips.",
        name: "Fahad",
        role: "Sales Executive",
        image: fahadImage,
    },
    {
        text: "I travel frequently for work, so being able to book appointments with healthcare providers in different cities through MedB is incredibly convenient.",
        name: "Alice",
        role: "Chief Accountant",
        image: aliceImage,
    },
    {
        text: "The ability to book urgent care appointments quickly and easily through the app has saved me countless hours of waiting in crowded waiting rooms.",
        name: "Samuel",
        role: "Accountant",
        image: samuelImage,
    },
];

const Testimonials = () => {
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
                className="mt-8 flex gap-6 overflow-x-auto snap-x snap-mandatory 
                    scrollbar-hide cursor-grab active:cursor-grabbing p-4 scroll-smooth"
                onMouseDown={handleMouseDown}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className="min-w-[80%] sm:min-w-[60%] md:min-w-[40%] lg:min-w-[30%] max-w-xs h-[70vh] 
                           bg-gradient-to-b from-[#D2ECEA] via-white to-[#6F64E7] p-6 rounded-2xl 
                           flex flex-col justify-between items-center text-white snap-start"
                    >
                        <p className="text-black mt-14 md:text-lg font-light leading-relaxed">
                            "{testimonial.text}"
                        </p>
                        <div className="flex flex-col items-center space-y-2">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-32 h-32 rounded-full border-4 border-white"
                            />
                            <h3 className="text-lg font-semibold">{testimonial.name}</h3>
                            <span className="text-sm opacity-80">{testimonial.role}</span>
                        </div>
                    </div>
                ))}
            </motion.div>
        </motion.section>
    );
};

export default Testimonials;
