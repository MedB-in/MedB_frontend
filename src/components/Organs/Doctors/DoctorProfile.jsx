import { motion } from 'framer-motion';
import back from "../../../assets/images/circle-arrow-left-01.png";

const DoctorProfile = () => {
    const handleBookAppointment = () => {
        console.log("Booking appointment...");
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="flex flex-col md:pt-24 p-12 w-full gap-8 max-md:py-5 max-md:max-w-full"
            >
                <motion.div className="items-start px-8 md:px-4 pt-24 md:pt-5 md:-mb-4 max-md:absolute max-md:top-5 max-md:left-5">
                    <img src={back} alt="Back" className="cursor-pointer w-8 h-8" onClick={() => window.history.back()} />
                </motion.div>
                <motion.div variants={fadeInUp} className="md:mt-9 mt-10 p-8 w-full max-md:max-w-full">
                    <div className="flex gap-8 max-md:flex-col">
                        <section className="w-[63%] max-md:w-full">
                            <div className="max-md:mt-10 max-md:max-w-full">
                                <motion.div variants={fadeInUp} className="flex gap-8 max-md:flex-col">
                                    <motion.div className="w-[43%] max-md:w-full">
                                        <motion.img
                                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c629161cbaebef286d17b729affe8769949e5a76"
                                            alt="Dr. David's profile"
                                            className="object-contain w-full aspect-[0.83] max-md:mt-10"
                                        />
                                    </motion.div>
                                    <motion.div className="ml-5 w-[57%] max-md:ml-0 max-md:w-full">
                                        <h1 className="font-bold text-3xl">Dr. David</h1>
                                        <h2 className="mt-1.5 text-3xl text-">Senior specialist - Cardiology</h2>
                                        <p className="mt-1.5 text-xl font-light">MBBS, MD (General medicine), DNB(Cardiology)</p>
                                        <h3 className="mt-5 text-2xl">Hospital</h3>
                                        <img
                                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b116e916a17cb782934b3be5950e2ab1bea9b304"
                                            alt="Hospital logo"
                                            className="object-contain aspect-[19.61] w-[39px]"
                                        />
                                        <p className="mt-1.5 font-semibold">Aster mims Kannur</p>
                                        <p className="mt-3 ml-5 text-xl">Lorem Ipsum is simply dummy text of</p>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </section>
                        <section className="ml-5 w-[37%] max-md:w-full">
                            <motion.div variants={fadeInUp} className="grow mt-6 max-md:mt-10">
                                <div className="w-full">
                                    <motion.div variants={fadeInUp} className="flex flex-col items-start px-11 py-10 text-2xl font-semibold text-center text-indigo-500 bg-white rounded-2xl border border-black border-opacity-50 shadow-lg max-md:px-5">
                                        <h3>Contact Number</h3>
                                        <p className="mt-5 text-xl text-black">1234567896</p>
                                        <h3 className="mt-10">Booking Number</h3>
                                        <p className="mt-5 text-xl text-black">1234567896</p>
                                        <h3 className="mt-10">Consulting Time</h3>
                                        <p className="mt-2.5 text-xl text-black">10:00 AM-2:00 PM</p>
                                    </motion.div>
                                    <motion.button
                                        onClick={handleBookAppointment}
                                        className="w-full px-3 py-6 mt-9 text-base font-medium bg-indigo-500 rounded-lg text-neutral-100 hover:bg-indigo-600 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Book Appointment
                                    </motion.button>
                                </div>
                            </motion.div>
                        </section>
                    </div>
                </motion.div>
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
                    className="flex relative flex-col self-center px-7 py-6 mt-16 w-full max-w-[1255px] border border-black border-opacity-50 rounded-3xl min-h-56 max-md:px-5 max-md:mt-10 "
                >
                    <h2 className="relative self-start text-3xl font-semibold text-center text-indigo-500">Overview</h2>
                    <p className="relative mt-6 text-base font-light tracking-normal leading-6 text-neutral-800">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s.
                    </p>
                </motion.section>
            </motion.div>
        </>
    );
};

export default DoctorProfile;