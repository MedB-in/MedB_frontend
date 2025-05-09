import React, { useState } from 'react';
import Calendar from '../../Atoms/Calender';
import TimeSlots from '../../Atoms/TImeSlots';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from "react-redux";
import { bookSlot } from '../../../services/doctors';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../../../redux/slices/authSlice';
import visitReasons from '../../../lib/reasonOptions';
import MobileNumberModal from '../MobileNumber';

function DoctorSlotModal({ onClose, doctorId, clinicId, department }) {
    const user = useState(JSON.parse(localStorage.getItem('userDetails')));
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [mobileModal, setMobileModal] = useState(() => {
        const storedValue = sessionStorage.getItem('mobileModal');
        return storedValue ? JSON.parse(storedValue) : true;
    });

    const { authenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDateSelect = ({ date, day }) => {
        setSelectedDate(date);
        setSelectedDay(day);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const isPastSlot = (slotTime) => {
        const nowUTC = new Date();
        const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));
        const [slotHour, slotMinute] = slotTime.split(':').map(Number);
        const slotDateIST = new Date(selectedDate);
        slotDateIST.setHours(slotHour, slotMinute, 0, 0);
        const slotDateISTAdjusted = new Date(slotDateIST.getTime() - (slotDateIST.getTimezoneOffset() * 60000));
        return slotDateISTAdjusted < nowIST;
    };

    const handleSubmit = async () => {
        const isPast = isPastSlot(selectedSlot);
        if (isPast) {
            toast.error('Selected slot is Expired. Please select another slot.');
            return;
        }
        if (!selectedDate || !selectedDay || !selectedSlot) {
            toast.error('Please select a date and time before submitting.');
            return;
        }
        if (!reason.trim()) {
            toast.error("Please enter a reason for the visit.");
            return;
        }

        if (!authenticated) {
            const loginUrl = '/login';
            const loginPopup = window.open(loginUrl, '_blank', 'width=500,height=600');
            if (!loginPopup) {
                toast.error('Popup blocked! Please allow pop-ups for this site.');
                return;
            }

            const messageListener = (event) => {
                if (event.origin === window.location.origin && event.data === 'authenticated') {
                    clearInterval(popupCheckInterval);
                    loginPopup.close();
                    window.removeEventListener('message', messageListener);
                    dispatch(setAuthenticated(true));
                    toast.success("Login successful!");
                }
            };

            window.addEventListener('message', messageListener);

            const popupCheckInterval = setInterval(() => {
                if (loginPopup.closed) {
                    clearInterval(popupCheckInterval);
                    window.removeEventListener('message', messageListener);
                    toast.error("Login cancelled. Please log in to book a slot.");
                }
            }, 500);

            return;
        }

        // if (user.contactNo === null && mobileModal === true) {
        //     setMobileModal(true);
        //     return;
        // }

        setLoading(true);
        try {
            await bookSlot({ clinicId, doctorId, date: selectedDate, time: selectedSlot, reason });
            toast.success("Slot booked successfully!");
            window.location.href = '/app/appointments';
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to book slot.");
        } finally {
            setLoading(false);
        }
    };

    // const setMobileModalAction = () => {
    //     setMobileModal(false);
    //     sessionStorage.setItem('mobileModal', false);
    // };

    return (
        <div className="fixed inset-0 z-50 p-5 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <main className="relative mx-auto px-2 w-full max-w-[713px] md:max-w-[40%] lg:max-w-[40%] bg-white border rounded-2xl max-h-[90vh] overflow-y-auto shadow-lg">
                <header className="box-border px-16 py-5 text-xl font-medium text-black max-md:px-10 max-sm:px-5">
                    Select Date and Time
                </header>
                <section className="relative px-16 py-5 max-md:px-10 max-sm:px-5">
                    <Calendar onDateSelect={handleDateSelect} />
                </section>
                <TimeSlots
                    clinicId={clinicId}
                    doctorId={doctorId}
                    date={selectedDate}
                    day={selectedDay}
                    onSlotSelect={handleSlotSelect}
                />
                {selectedSlot && (
                    <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Reason for visit:</h3>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                            className="w-full px-4 py-2 border rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {/* Suggested reasons */}
                        {visitReasons[department?.charAt(0).toUpperCase() + department?.slice(1)]?.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-1">Common reasons:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {visitReasons[department?.charAt(0).toUpperCase() + department?.slice(1)].map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setReason(item)}
                                            className="px-3 py-1 bg-gray-200 text-sm rounded-full hover:bg-indigo-200 transition"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex justify-end px-16 pb-5 max-md:px-10 max-sm:px-5">
                    <motion.button
                        type="button"
                        className="flex items-center justify-center px-8 py-2 text-base font-medium bg-indigo-500 rounded-3xl text-white hover:bg-indigo-600 transition-transform"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                    >
                        {loading ? 'Booking...' : 'Submit'}
                    </motion.button>
                </div>
                <button
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    ✖
                </button>
            </main>
            {/* {mobileModal && (
                <MobileNumberModal
                    setMobileModal={setMobileModalAction}
                />
            )} */}
        </div>
    );
}

export default DoctorSlotModal;
