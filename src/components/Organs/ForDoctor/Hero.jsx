import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import HeroImage from "../../../assets/images/healthcare/hero.png";
import HeroMap from "../../../assets/images/healthcare/hero-map.png";
import ArrowRightUp from "../../../assets/images/healthcare/arrow-right-up.png";

const Hero = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isClinicPage = location.pathname === "/for-clinic";
    return (
        <>
            <div
                className="fixed top-[60dvh] md:top-[65dvh] right-2 z-[100] flex items-center gap-[14px] px-3 py-2 bg-[#6F64E7] text-white text-[16px] font-poppins rounded-[30px] cursor-pointer"
                title="Send us a message"
                onClick={() => navigate(!isClinicPage ? '/register-doctor' : '/register-clinic')}
            >
                <span>Register Now</span>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <img src={ArrowRightUp} alt="WhatsApp" className="w-6" />
                </div>
            </div>
            <section
                className="flex flex-col lg:flex-row items-center h-screen justify-between mt-24 px-6 sm:px-8 md:px-12 lg:px-16 py-10 md:py-16 lg:py-24 bg-[radial-gradient(circle_at_top_left,rgba(106,90,205,0.1)_28%,#fff_38%)] bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${HeroMap})` }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="w-full lg:w-1/2 text-center lg:text-left px-4 lg:px-0 mb-10 lg:mb-24"
                >
                    <h1 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-tight font-light font-poppins bg-black bg-clip-text text-transparent">
                        <span className="font-extrabold">
                            {isClinicPage ? "Clinics" : "Doctors"}, get ready to streamline your schedules with <span className="text-[#6F64E7]"> MedB!</span>
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: true }}
                    className="w-full lg:w-1/2 flex justify-center px-4 lg:px-0"
                >
                    <div className="rounded-[10px] w-full max-w-3xl">
                        <img src={HeroImage} alt="Doctor" className="w-full object-contain" />
                    </div>
                </motion.div>
            </section>
        </>
    );
};

export default Hero;
