import React, { useEffect, useState } from 'react';
import { getDoctorSlots } from '../../services/publicApi';
import { Sun, SunMoon, Moon, CloudSun } from 'lucide-react';

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

    const categorizeSlots = (slots) => {
        return {
            morning: slots.filter(slot => isInRange(slot.time, '06:00', '11:59')),
            afternoon: slots.filter(slot => isInRange(slot.time, '12:00', '16:59')),
            evening: slots.filter(slot => isInRange(slot.time, '17:00', '19:59')),
            night: slots.filter(slot => isInRange(slot.time, '20:00', '23:59')),
        };
    };

    const isInRange = (time, start, end) => {
        return time >= start && time <= end;
    };

    const timeCategories = categorizeSlots(timeSlots);

    const renderCategory = (title, icon, slots) => {
        if (!slots.length) return null;
        return (
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <span className="text-sm text-black text-opacity-60">{title} ({slots.length} slots)</span>
                </div>
                <div className="grid gap-3 grid-cols-[repeat(4,1fr)] md:grid-cols-[repeat(3,1fr)] lg:grid-cols-[repeat(5,1fr)]">
                    {slots.map((slot, index) => (
                        <div
                            key={index}
                            className={`p-2.5 text-sm text-center rounded-md cursor-pointer transition-all duration-300 ${slot.booked
                                ? 'text-gray-500 bg-gray-300 cursor-no-drop'
                                : selectedSlot === slot.time
                                    ? 'bg-indigo-500 text-white border border-green-700'
                                    : 'bg-white border border-indigo-500 text-indigo-500 font-semibold hover:bg-indigo-50'}`}
                            onClick={() => !slot.booked && handleSlotClick(slot)}
                        >
                            {new Date(`1970-01-01T${slot.time}`).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <section className="px-4 md:px-14 py-4 mx-auto my-5 rounded-2xl border border-solid backdrop-blur-[18.15px] bg-white bg-opacity-70 border-indigo-500 border-opacity-10">
            {renderCategory('Morning', <Sun className="w-5 h-5 text-yellow-500" />, timeCategories.morning)}
            {renderCategory('Afternoon', <CloudSun className="w-5 h-5 text-orange-500" />, timeCategories.afternoon)}
            {renderCategory('Evening', <SunMoon className="w-5 h-5 text-purple-500" />, timeCategories.evening)}
            {renderCategory('Night', <Moon className="w-5 h-5 text-blue-500" />, timeCategories.night)}
        </section>
    );
};

export default TimeSlots;
