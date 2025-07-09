import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import topLeft from "../../../assets/images/doctor-testimonials/top-left.svg";
import bottomRight from "../../../assets/images/doctor-testimonials/bottom-right.svg";
import quotesTop from "../../../assets/images/doctor-testimonials/quotes-top.svg";
import quotesBottom from "../../../assets/images/doctor-testimonials/quotes-bottom.svg";
import QuoteImage from "../../Atoms/Landingpage/QuoteImage";

const testimonials = [
    {
        quote:
            "The MedB platform is truly innovative, particularly its online appointment feature, which has streamlined my practice. It's user-friendly and efficient, saving time for both me and my patients.",
        doctorName: "Dr. Sanin Haneef",
        credentials: "(MBBS)",
        image:
            "https://st4.depositphotos.com/1017986/24504/i/450/depositphotos_245042972-stock-photo-smiling-indian-male-doctor-showing.jpg",
    },
    {
        quote:
            "MedB is revolutionizing healthcare accessibility with its online appointment system. It has not only enhanced my interaction with patients but also made managing schedules incredibly easy.",
        doctorName: "Dr. Shehanas",
        credentials: "(MBBS)",
        image:
            "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
    },
    {
        quote:
            "The convenience that MedB offers through its online appointments is commendable. It allows me to focus on providing quality care instead of managing logistics.",
        doctorName: "Dr. Shas Hussain A P",
        credentials: "(BDS)",
        image:
            "https://static.vecteezy.com/system/resources/thumbnails/053/751/854/small/closeup-portrait-of-handsome-attractive-indian-bearded-man-doctor-wearing-stylish-eyeglasses-photo.jpg",
    },
    {
        quote:
            "MedB has significantly improved the efficiency of my practice. The seamless appointment scheduling is a game-changer for both doctors and patients.",
        doctorName: "Dr. Aisha Khan",
        credentials: "(MD)",
        image:
            "https://static.vecteezy.com/system/resources/thumbnails/028/287/555/small/an-indian-young-female-doctor-isolated-on-green-ai-generated-photo.jpg",
    },
    {
        quote:
            "With MedB, my clinic operations are much more organized. I appreciate its ease of use and the continuous improvements to the platform.",
        doctorName: "Dr. Rohan Patel",
        credentials: "(MBBS, MD)",
        image:
            "https://static.vecteezy.com/system/resources/thumbnails/028/287/384/small/a-mature-indian-male-doctor-on-a-white-background-ai-generated-photo.jpg",
    },
    {
        quote:
            "MedB's innovative features have significantly enhanced patient engagement. The online consultation system is incredibly useful, and I highly recommend it to my fellow doctors.",
        doctorName: "Dr. Meera Joshi",
        credentials: "(BDS)",
        image:
            "https://media.istockphoto.com/id/1730222050/photo/photo-of-doctor-lady-smile-looking-at-camera-wear-stethoscope-white-uniform-isolate-white.jpg?s=612x612&w=0&k=20&c=KfZT1DzVMcGvHZZg4NnUhHwvOiI5xPYRe1AWvCwOqE4=",
    },
];

const TestimonialSection = () => {
    const scrollRef = useRef(null);

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
                className="mt-8 overflow-hidden p-4 group"
            >
                <div className="flex gap-6 animate-marquee group-hover:[animation-play-state:paused]">
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