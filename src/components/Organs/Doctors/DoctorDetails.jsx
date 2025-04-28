import { motion } from 'framer-motion';
import back from "../../../assets/images/circle-arrow-left-01.png";
import bgOverlay from "../../../assets/images/doctor-bg-overlay.png";
import { useEffect } from 'react';

const DoctorDetails = ({ doctor }) => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="pt-24 p-6">
            <div
                className="items-start px-6 md:px-12 pt-5 md:-mb-4">
                <img src={back} alt="Back" className="cursor-pointer" onClick={() => window.history.back()} />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="md:mt-8 mt-10 md:p-16 w-full">
                <div className="flex flex-col md:flex-row md:gap-8">

                    <section className="w-full">
                        {/* Mobile UI */}
                        <motion.section
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="md:hidden flex flex-col items-center text-center p-4">
                            <div className="relative w-40 h-52 overflow-hidden rounded-2xl">
                                <img src={doctor?.profilePicture} className="object-cover w-full h-full border-2 border-indigo-500" alt="Doctor" />
                            </div>
                            <h1 className="mt-4 font-bold text-2xl">Dr. {doctor?.firstName} {doctor?.middleName || ''} {doctor?.lastName || ''}</h1>
                            <h2 className="mt-1 text-xl">{doctor?.speciality}</h2>
                            <p className="mt-1 text-lg">Gender: {doctor?.gender}</p>
                            <p className="mt-1 text-lg font-light">{doctor?.qualifications}</p>
                            <p className="mt-1 text-lg">Experience: {doctor?.experience} years</p>
                            <p className="mt-1 text-lg">Contact: {doctor?.phone}</p>
                            <p className="mt-1 text-lg">Email: {doctor?.email}</p>
                        </motion.section>

                        {/* Desktop UI */}
                        <section className="hidden md:flex  w-full">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="flex justify-between md:flex-row gap-8 w-full"
                            >
                                <figure className="max-w-xs rounded-none">
                                    <div className="relative flex justify-center items-start px-2.5 py-3.5 rounded-2xl aspect-[0.791] overflow-hidden">
                                        <img src={bgOverlay} className="absolute inset-0 size-full object-cover -translate-x-5" alt="Background overlay" />
                                        <img src={doctor?.profilePicture} className="object-cover h-full rounded-2xl border-2 border-indigo-500 translate-x-2" alt="Doctor" />
                                    </div>
                                </figure>
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="w-full md:w-[50%]"
                                >
                                    <h1 className="font-bold text-3xl capitalize">Dr. {doctor?.firstName} {doctor?.middleName || ''} {doctor?.lastName || ''}</h1>
                                    <h2 className="mt-1.5 text-3xl">{doctor?.speciality}</h2>
                                    <p className="mt-1.5 text-lg">Gender: {doctor?.gender}</p>
                                    <p className="mt-1.5 text-xl font-light">{doctor?.qualifications}</p>
                                    <p className="mt-1.5 text-lg">Experience: {doctor?.experience} years</p>
                                    <p className="mt-1.5 text-lg">Contact: {doctor?.phone}</p>
                                    <p className="mt-1.5 text-lg">Email: {doctor?.email}</p>
                                </motion.div>
                                <section className="hidden md:flex mt-8 flex-col px-7 py-6 w-full md:w-[50%] border border-black border-opacity-50 rounded-3xl self-start">
                                    <h2 className="text-3xl font-semibold text-indigo-500">Overview</h2>
                                    <p className="mt-6 text-base font-light leading-6 text-neutral-800">
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                    </p>
                                </section>
                            </motion.div>
                        </section>
                        <section
                            className="flex md:hidden flex-col self-center p-4 w-full max-w-md mt-6 border border-black border-opacity-30 rounded-xl shadow-md mx-auto"
                        >
                            <h2 className="text-xl font-semibold text-indigo-500">Overview</h2>
                            <p className="mt-4 text-sm font-light leading-5 text-neutral-800">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                            </p>
                        </section>
                    </section>
                </div>
            </motion.div>
        </div>
    );
};

export default DoctorDetails;
