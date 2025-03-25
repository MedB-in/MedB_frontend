import { motion } from 'framer-motion';
import back from "../../../assets/images/circle-arrow-left-01.png";
import days from "../../../lib/slotDays";
import location from "../../../assets/images/location-feature.png";
import bgOverlay from "../../../assets/images/doctor-bg-overlay.png";
import line from "../../../assets/images/line-doctor.png";
import DoctorSlotModal from './DoctorSlotModal';
import { useState } from 'react';

const DoctorProfile = ({ doctor, clinic, doctorId, clinicId, loading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBookAppointment = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const fadeInUp = {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const dayMap = days.reduce((acc, day) => {
        acc[day.id] = day.label;
        return acc;
    }, {});

    const groupedTimings = (doctor?.timings || []).reduce((acc, timing) => {
        const key = `${timing.timingFrom}-${timing.timingTo}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push({ day: timing.day, label: dayMap[timing.day] || `Day ${timing.day}` });
        return acc;
    }, {});

    Object.values(groupedTimings).forEach(dayList => dayList.sort((a, b) => a.day - b.day));
    const sortedEntries = Object.entries(groupedTimings).sort((a, b) => a[1][0].day - b[1][0].day);

    const SkeletonLoader = () => (
        <div className="animate-pulse md:mt-8 mt-10 p-16 w-full">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="max-w-xs rounded-none">
                    <div className="relative w-48 h-60 bg-gray-300 rounded-2xl"></div>
                </div>
                <div className="w-full md:w-[57%]">
                    <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-8"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );

    return (
        <motion.div className="pt-24 p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <motion.div className="items-start px-6 md:px-12 pt-5 md:-mb-4">
                <img src={back} alt="Back" className="cursor-pointer" onClick={() => window.history.back()} />
            </motion.div>
            {loading ? (
                <SkeletonLoader />
            ) : (
                <>
                    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="md:mt-8 mt-10 md:p-16 w-full">
                        <div className="flex flex-col md:flex-row md:gap-8">
                            <motion.button onClick={handleBookAppointment} className="md:hidden w-full px-3 my-10 py-6 mt-9 text-base font-medium bg-indigo-500 rounded-lg text-white hover:bg-indigo-600 transition-transform" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                Book Appointment
                            </motion.button>
                            <section className="md:w-[63%] w-full">
                                <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-8">
                                    <figure className="max-w-xs rounded-none">
                                        <div className="relative flex justify-center items-start px-2.5 py-3.5 rounded-2xl aspect-[0.791] overflow-hidden">
                                            <img src={bgOverlay} className="absolute inset-0 size-full object-cover -translate-x-5" alt="Background overlay" />
                                            <img src={doctor?.profilePicture} className="object-cover h-full rounded-2xl border-2 border-indigo-500 translate-x-2" alt="Doctor" />
                                        </div>
                                    </figure>
                                    <motion.div variants={fadeInUp} className="w-full md:w-[57%]">
                                        <h1 className="font-bold text-3xl capitalize">Dr. {doctor?.firstName} {doctor?.middleName || ''} {doctor?.lastName || ''}</h1>
                                        <h2 className="mt-1.5 text-3xl">{doctor?.speciality}</h2>
                                        <p className="mt-1.5 text-xl font-light">{doctor?.qualifications}</p>
                                        <h3 className="mt-8 text-3xl">Clinic</h3>
                                        <img src={line} alt="" className="object-contain w-10" />
                                        <p className="mt-2 font-semibold text-3xl capitalize">{clinic?.clinicName}</p>
                                        <div className="mt-3 text-xl flex items-center">
                                            <img src={location} alt="Location Icon" className="w-6 h-6 mr-2 object-contain" />
                                            {clinic?.clinicAddress}, {clinic?.clinicCity || ''}, {clinic?.clinicDistrict || ''}, {clinic?.clinicState || ''}, {clinic?.clinicCountry || ''}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </section>
                            <section className="md:w-[37%] w-full">
                                <motion.div variants={fadeInUp} className="mt-6 md:mt-0">
                                    <div className="w-full">
                                        <motion.div variants={fadeInUp} className="flex flex-col px-11 py-10 text-2xl font-semibold text-indigo-500 bg-white rounded-2xl border border-black border-opacity-50 shadow-lg">
                                            <h3>Contact Number</h3>
                                            <p className="mt-5 text-xl text-black">{doctor?.phone}</p>
                                            <h3 className="mt-10">Booking Number</h3>
                                            <p className="mt-5 text-xl text-black">{clinic?.contactNumber}</p>
                                            <h3 className="mt-10">Consulting Time</h3>
                                            {sortedEntries.length > 0 ? (
                                                <ul className="mt-2.5">
                                                    {sortedEntries.map(([time, days], index) => (
                                                        <li key={index} className="text-xl text-black">
                                                            <span className='font-extralight'>{days.map(day => day.label).join(', ')}:</span> {time.replace('-', ' - ')}.
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="mt-2.5 text-xl text-black">No timings available</p>
                                            )}
                                        </motion.div>
                                        <motion.button onClick={handleBookAppointment} className="hidden md:block w-full px-3 py-6 mt-9 text-base font-medium bg-indigo-500 rounded-lg text-white hover:bg-indigo-600 transition-transform" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            Book Appointment
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </section>
                        </div>
                    </motion.div>
                </>
            )}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
                className="flex flex-col self-center px-7 py-6 w-full max-w-[1255px] mt-10 border border-black border-opacity-50 rounded-3xl mx-auto"
            >
                <h2 className="text-3xl font-semibold text-indigo-500">Overview</h2>
                <p className="mt-6 text-base font-light leading-6 text-neutral-800">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                </p>
            </motion.section>
            {isModalOpen && <DoctorSlotModal doctorId={doctorId} clinicId={clinicId} onClose={closeModal} />}
        </motion.div>
    );
};

export default DoctorProfile;
