import React, { useState } from 'react';
import Calendar from '../../Atoms/Calender';
import TimeSlots from '../../Atoms/TImeSlots';
import { motion } from 'framer-motion';
import { useSelector } from "react-redux";
import { bookSlot } from '../../../services/doctors';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthenticated } from '../../../redux/slices/authSlice';

function DoctorSlotModal({ onClose, doctorId, clinicId }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const { authenticated } = useSelector(state => state.auth);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleDateSelect = ({ date, day }) => {
        setSelectedDate(date);
        setSelectedDay(day);
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
    };

    const handleSubmit = async () => {
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

        setLoading(true);
        try {
            if (!selectedDate || !selectedDay || !selectedSlot) {
                toast.error('Please select a date and time before submitting.');
                return;
            }
            if (!reason.trim()) {
                toast.error("Please enter a reason for the visit.");
                return;
            }
            await bookSlot({ clinicId, doctorId, date: selectedDate, time: selectedSlot, reason });
            toast.success("Slot booked successfully!");
            navigate('/appointments');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to book slot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 p-5 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <main className="relative mx-auto px-2 w-full max-w-[713px] md:max-w-[40%] lg:max-w-[40%] bg-white border rounded-2xl max-h-[90vh] overflow-y-auto shadow-lg">
                <header className="box-border px-16 py-5 w-full text-xl font-medium text-black shadow-[0_4px_4px_rgba(0,0,0,0.05)] max-md:px-10 max-sm:px-5 max-sm:py-8 max-sm:h-auto">
                    Select Date and Time
                </header>
                <section className="relative px-16 py-5 max-md:px-10 max-sm:px-5">
                    <Calendar onDateSelect={handleDateSelect} />
                </section>
                <TimeSlots clinicId={clinicId} doctorId={doctorId} date={selectedDate} day={selectedDay} onSlotSelect={handleSlotSelect} />
                {selectedSlot && (
                    <div className=" p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Reason for visit:</h3>
                        <input
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
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
        </div>
    );
}

export default DoctorSlotModal;
