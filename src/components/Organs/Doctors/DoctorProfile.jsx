import { motion } from 'framer-motion';
import back from "../../../assets/images/circle-arrow-left-01.png";
import days from "../../../lib/slotDays";
import location from "../../../assets/images/location-feature.png";
import bgOverlay from "../../../assets/images/doctor-bg-overlay.png";
import line from "../../../assets/images/line-doctor.png";
import DoctorSlotModal from './DoctorSlotModal';
import { useEffect, useState } from 'react';

const DoctorProfile = ({ doctor, clinic, doctorId, clinicId, loading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    const handleBookAppointment = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolledHeight = window.innerHeight + window.scrollY;
            const totalHeight = document.documentElement.scrollHeight;
            setIsVisible(scrolledHeight < totalHeight - 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const dayMap = days.reduce((acc, day) => {
        acc[day.id] = day.label;
        return acc;
    }, {});

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const formatTimeTo12Hour = (time) => {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const groupedTimings = (doctor?.timings || []).reduce((acc, timing) => {
        const fromTime = formatTimeTo12Hour(timing.timingFrom);
        const toTime = formatTimeTo12Hour(timing.timingTo);
        const key = `${fromTime} - ${toTime}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push({ day: timing.day, label: dayMap[timing.day] || `Day ${timing.day}` });
        return acc;
    }, {});

    Object.values(groupedTimings).forEach(dayList => dayList.sort((a, b) => a.day - b.day));
    const sortedEntries = Object.entries(groupedTimings).sort((a, b) => a[1][0].day - b[1][0].day);

    const displayAddress = [
        // clinic?.clinicAddress,
        clinic?.clinicCity !== 'null' ? clinic?.clinicCity : '',
        clinic?.clinicDistrict !== 'null' ? clinic?.clinicDistrict : '',
        clinic?.clinicState !== 'null' ? clinic?.clinicState : '',
        clinic?.clinicCountry
    ].filter(Boolean).join(', ');


    const SkeletonLoader = () => (
        <div className="animate-pulse mt-10 md:mt-8 p-6 md:p-16 w-full shadow-lg rounded-xl">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                <div className="w-full md:w-48 h-52 md:h-60 bg-gray-300 rounded-2xl"></div>
                <div className="w-full">
                    <div className="h-6 md:h-8 bg-gray-300 rounded w-3/4 mb-3 md:mb-4"></div>
                    <div className="h-5 md:h-6 bg-gray-300 rounded w-1/2 mb-3 md:mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-6 md:mb-8"></div>
                    <div className="h-5 md:h-6 bg-gray-300 rounded w-1/4 mb-3 md:mb-4"></div>
                    <div className="h-5 md:h-6 bg-gray-300 rounded w-full mb-1 md:mb-2"></div>
                    <div className="h-5 md:h-6 bg-gray-300 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="pt-24 p-6">
            <div
                className="items-start px-6 md:px-12 pt-5 md:-mb-4">
                <img src={back} alt="Back" className="cursor-pointer" onClick={() => window.history.back()} />
            </div>
            {loading ? (
                <SkeletonLoader />
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="md:mt-8 mt-10 md:p-16 w-full md:shadow-lg md:rounded-xl ">
                        <div className="flex flex-col md:flex-row md:gap-8 ">
                            <div
                                onClick={handleBookAppointment}
                                className="md:hidden relative">
                                <button
                                    className={`fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] py-4 text-base font-medium bg-indigo-500 rounded-lg text-white hover:bg-indigo-600 shadow-lg transition-all duration-700 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                                        }`}
                                >
                                    Book Appointment
                                </button>
                            </div>
                            <section className="w-full">
                                {/* Mobile UI */}
                                <motion.section
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="md:hidden flex flex-col items-center text-center p-4">
                                    <div className="relative w-40 h-52 overflow-hidden drop-shadow-2xl rounded-2xl">
                                        <img src={doctor?.profilePicture} className="object-cover w-full h-full rounded-2xl border-2 border-indigo-500" alt="Doctor" />
                                    </div>
                                    <h1 className="mt-4 font-bold text-2xl">Dr. {doctor?.firstName} {doctor?.middleName || ''} {doctor?.lastName || ''}</h1>
                                    <h2 className="mt-1 text-xl">{doctor?.speciality}</h2>
                                    <p className="mt-1 text-lg font-light">{doctor?.qualifications}</p>
                                    <h3 className="mt-6 text-xl">Clinic</h3>
                                    <img src={line} alt="Line" className="w-10 mx-auto" />
                                    <p className="mt-2 font-semibold text-xl">{clinic?.clinicName}</p>
                                    {displayAddress && (
                                        <div className="mt-2 text-base flex items-center justify-center">
                                            {displayAddress}
                                        </div>
                                    )}
                                </motion.section>
                                {/* Desktop UI */}
                                <section className="hidden md:flex md:w-[63%] w-full">
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.8, ease: "easeOut" }}
                                        className="flex flex-col md:flex-row gap-8">
                                        <figure className="max-w-xs rounded-none">
                                            <div className="relative flex justify-center items-start px-2.5 py-3.5 rounded-2xl aspect-[0.791] drop-shadow-2xl overflow-hidden">
                                                <img src={bgOverlay} className="absolute inset-0 size-full object-cover -translate-x-5" alt="Background overlay" />
                                                <img src={doctor?.profilePicture} className="object-cover h-full rounded-2xl border-2 border-indigo-500 translate-x-2" alt="Doctor" />
                                            </div>
                                        </figure>
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="w-full md:w-[57%] mt-10">
                                            <h1 className="font-bold text-3xl capitalize">Dr. {doctor?.firstName} {doctor?.middleName || ''} {doctor?.lastName || ''}</h1>
                                            <h2 className="mt-1.5 text-3xl">{doctor?.speciality}</h2>
                                            <p className="mt-1.5 text-xl font-light">{doctor?.qualifications}</p>
                                            <h3 className="mt-8 text-3xl">Clinic</h3>
                                            <img src={line} alt="" className="object-contain w-10" />
                                            <p className="mt-2 font-semibold text-3xl capitalize">{clinic?.clinicName}</p>
                                            {displayAddress && (
                                                <div className="mt-3 text-xl flex items-center">
                                                    <img src={location} alt="Location Icon" className="w-6 h-6 mr-2 object-contain" />
                                                    {displayAddress}
                                                </div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                </section>
                            </section>
                            <section className="md:w-[37%] w-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="mt-6 md:mt-0">
                                    <div className="w-full">
                                        {/* Desktop UI */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className="md:flex hidden flex-col px-11 py-10 text-xl font-semibold text-indigo-500 bg-white rounded-2xl border border-black border-opacity-50 shadow-2xl">
                                            <h3 >Booking Number</h3>
                                            <p className="mt-2 text-xl text-black">{clinic?.contactNumber}</p>
                                            <h3 className="mt-5">Consulting Time</h3>
                                            {sortedEntries.length > 0 ? (
                                                <ul className="mt-2">
                                                    {sortedEntries.map(([time, days], index) => (
                                                        <li key={index} className="text-black text-sm">
                                                            <span className="font-light">{days.map(day => day.label).join(', ')}:</span>
                                                            <span className="font-semibold ml-1">{time.replace('-', ' - ')}.</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="mt-2 text-xl text-black">No timings available</p>
                                            )}
                                            <h3 className="mt-5">Consultation Fee</h3>
                                            <p className="mt-2 text-xl text-black"> {doctor?.consultationFee ? `₹ ${doctor?.consultationFee}/-` : 'Not Available'}</p>
                                        </motion.div>
                                        {/* Mobile UI */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 50 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.8, ease: "easeOut" }} className="flex md:hidden flex-col p-4 text-base font-medium text-indigo-500 bg-white rounded-xl border border-black border-opacity-30 shadow-md">
                                            <h3>Contact Number</h3>
                                            <p className="mt-3 text-sm text-black">{doctor?.phone ? ` ${doctor?.phone}` : 'Not Available'}</p>

                                            <h3 className="mt-6">Booking Number</h3>
                                            <p className="mt-3 text-sm text-black">{clinic?.contactNumber}</p>

                                            <h3 className="mt-6">Consulting Time</h3>
                                            {sortedEntries.length > 0 ? (
                                                <ul className="mt-2">
                                                    {sortedEntries.map(([time, days], index) => (
                                                        <li key={index} className="text-sm text-black">
                                                            <span className='font-light'>{days.map(day => day.label).join(', ')}:</span> {time.replace('-', ' - ')}.
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="mt-2 text-sm text-black">No timings available</p>
                                            )}
                                            <h3 className="mt-6">Consultation Fee</h3>
                                            <p className="mt-3 text-sm text-black"> {doctor?.consultationFee ? `₹ ${doctor?.consultationFee}/-` : 'Not Available'}</p>
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
            <section
                className="hidden md:flex flex-col self-center px-7 py-6 w-full max-w-[1255px] mt-10 border border-black border-opacity-50 rounded-3xl mx-auto"
            >
                <h2 className="text-3xl font-semibold text-indigo-500">Overview</h2>
                <p className="mt-6 text-base font-light leading-6 text-neutral-800">
                    {doctor?.doctorOverview ? doctor?.doctorOverview : 'No overview available'}
                </p>
            </section>

            <section
                className="flex md:hidden flex-col self-center p-4 w-full max-w-md mt-6 border border-black border-opacity-30 rounded-xl shadow-md mx-auto"
            >
                <h2 className="text-xl font-semibold text-indigo-500">Overview</h2>
                <p className="mt-4 text-sm font-light leading-5 text-neutral-800">
                    {doctor?.doctorOverview ? doctor?.doctorOverview : 'No overview available'}
                </p>
            </section>
            {isModalOpen && <DoctorSlotModal doctorId={doctorId} clinicId={clinicId} department={doctor?.speciality} onClose={closeModal} />}
        </div>
    );
};

export default DoctorProfile;
