import React, { useEffect, useState } from 'react';
import { getDoctorSlots } from '../../services/publicApi';

const TimeSlots = ({ clinicId, doctorId, date, day, onSlotSelect }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const response = await getDoctorSlots(clinicId, doctorId, date, day);
                setTimeSlots(response?.data?.slots || []);
            } catch (error) {
                console.error('Error fetching time slots:', error);
            }
        };
        setSelectedSlot(null);
        onSlotSelect(null);
        if (clinicId && doctorId && date && day !== undefined) {
            fetchSlots();
        }
    }, [clinicId, doctorId, date, day]);

    const handleSlotClick = (slot) => {
        if (!slot.booked) {
            setSelectedSlot(slot.time);
            onSlotSelect(slot.time);
        }
    };

    return (
        <section className="px-14 py-4 mx-auto my-5 rounded-2xl border border-solid backdrop-blur-[18.15px] bg-white bg-opacity-70 border-indigo-500 border-opacity-10 w-[607px] max-sm:p-4 max-sm:w-[90%]">
            <div className="mb-4 text-sm text-black text-opacity-60">
                <span>Available Slots</span>
                <span className="text-red-600 text-opacity-60">*</span>
            </div>
            <div className="grid gap-3 grid-cols-[repeat(3,1fr)] max-sm:grid-cols-[1fr]">
                {timeSlots.length > 0 ? (
                    timeSlots.map((slot, index) => (
                        <div
                            key={index}
                            className={`p-2.5 text-sm text-center rounded-md cursor-pointer transition-all duration-300 ${slot.booked
                                ? "text-gray-500 bg-gray-300 cursor-no-drop"
                                : selectedSlot === slot.time
                                    ? "bg-indigo-500 text-white border border-green-700"
                                    : "bg-black bg-opacity-10 text-neutral-800 hover:bg-indigo-50"
                                }`}
                            onClick={() => !slot.booked && handleSlotClick(slot)}
                        >
                            {new Date(`1970-01-01T${slot.time}`).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })}
                        </div>
                    ))
                ) : (
                    <p className="col-span-3 text-center text-sm text-black text-opacity-60 py-6">
                        {timeSlots.length === 0 && date ? "No available slots" : "Select a date and time"}
                    </p>
                )}
            </div>
        </section>
    );
};

export default TimeSlots;
