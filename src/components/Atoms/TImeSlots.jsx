import { useEffect, useState } from 'react';
import { getDoctorSlots } from '../../services/publicApi';
import { Sun, SunMoon, Moon, CloudSun } from 'lucide-react';
import toast from 'react-hot-toast';

const TimeSlots = ({ clinicId, doctorId, date, day, onSlotSelect }) => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            try {
                const response = await getDoctorSlots(clinicId, doctorId, date, day);
                setTimeSlots(response?.data?.slots || []);
            } catch (error) {
                toast.error('Error fetching time slots:', error);
            }
            setLoading(false);
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

    const categorizeSlots = (slots) => ({
        morning: slots.filter(slot => isInRange(slot.time, '06:00', '11:59')),
        afternoon: slots.filter(slot => isInRange(slot.time, '12:00', '16:59')),
        evening: slots.filter(slot => isInRange(slot.time, '17:00', '19:59')),
        night: slots.filter(slot => isInRange(slot.time, '20:00', '23:59')),
    });

    const isInRange = (time, start, end) => time >= start && time <= end;
    const timeCategories = categorizeSlots(timeSlots);
    const hasNoSlots = date && Object.values(timeCategories).every(category => category.length === 0);

    const isPastSlot = (slotTime) => {
        const nowUTC = new Date();
        const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));
        const [slotHour, slotMinute] = slotTime.split(':').map(Number);
        const slotDateIST = new Date(date);
        slotDateIST.setHours(slotHour, slotMinute, 0, 0);
        const slotDateISTAdjusted = new Date(slotDateIST.getTime() - (slotDateIST.getTimezoneOffset() * 60000));

        return slotDateISTAdjusted < nowIST;
    };

    const renderCategory = (title, icon, slots) => {
        if (!slots.length) return null;
        return (
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                    {icon}
                    <span className="text-sm text-black text-opacity-60">{title} ({slots.length} slots)</span>
                </div>
                <div className="grid gap-3 grid-cols-[repeat(3,1fr)] sm:grid-cols-[repeat(4,1fr)] md:grid-cols-[repeat(3,1fr)] lg:grid-cols-[repeat(4,1fr)]">
                    {slots.map((slot, index) => (
                        <div
                            key={index}
                            className={`p-2.5 text-sm text-center rounded-md cursor-pointer transition-all duration-300 ${slot.booked || isPastSlot(slot.time)
                                ? 'text-red-500 bg-gray-300 cursor-not-allowed'
                                : selectedSlot === slot.time
                                    ? 'bg-indigo-500 text-white border border-green-700'
                                    : 'bg-white border border-indigo-500 text-indigo-500 font-semibold hover:bg-indigo-50'
                                }`}
                            onClick={() => !slot.booked && !isPastSlot(slot.time) && handleSlotClick(slot)}
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

    const renderSkeleton = () => (
        <div className="animate-pulse">
            {['Morning', 'Afternoon', 'Evening'].map((title, index) => (
                <div key={index} className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                        <div className="h-4 bg-gray-300 w-32 rounded"></div>
                    </div>
                    <div className="grid gap-3 grid-cols-[repeat(3,1fr)] sm:grid-cols-[repeat(4,1fr)] md:grid-cols-[repeat(3,1fr)] lg:grid-cols-[repeat(5,1fr)]">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-10 bg-gray-300 rounded-md"></div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <section className="px-4 md:px-14 py-4 mx-auto my-5 rounded-2xl border border-solid backdrop-blur-[18.15px] bg-white bg-opacity-70 border-indigo-500 border-opacity-10">
            {!hasNoSlots &&
                <div className="flex items-center gap-2 justify-end">
                    <p className="text-gray-600 text-sm">Slots are in Indian Timezone - <span className='font-bold'> IST</span></p>
                    <div className="h-4 w-4 bg-gray-300"></div>
                    <p className="text-gray-500 text-sm">Not available</p>
                </div>
            }

            {loading ? renderSkeleton() : hasNoSlots ? (
                <p className="text-center text-gray-500">No slots available for the selected date.</p>
            ) : (
                <>
                    {renderCategory('Morning', <Sun className="w-5 h-5 text-yellow-500" />, timeCategories.morning)}
                    {renderCategory('Afternoon', <CloudSun className="w-5 h-5 text-orange-500" />, timeCategories.afternoon)}
                    {renderCategory('Evening', <SunMoon className="w-5 h-5 text-purple-500" />, timeCategories.evening)}
                    {renderCategory('Night', <Moon className="w-5 h-5 text-blue-500" />, timeCategories.night)}
                </>
            )}
        </section>
    );
};

export default TimeSlots;