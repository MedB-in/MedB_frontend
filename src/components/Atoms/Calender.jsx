import React, { useState } from 'react';
import days from '../../lib/slotDays';
import { format } from 'date-fns';
import dropdown from '../../assets/images/dropdown.png';
import prev from '../../assets/images/prev-icon.png';
import next from '../../assets/images/next-icon.png';

const Icon = ({ type }) => {
    const icons = { dropdown, prev, next };
    return <img src={icons[type]} alt={type} width={17} height={17} style={{ cursor: 'pointer' }} />;
};

const Calendar = ({ onDateSelect }) => {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 31);

    const handlePrevMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() - 1));
    const handleNextMonth = () => setDate(new Date(date.getFullYear(), date.getMonth() + 1));

    const handleDateSelect = (selectedDay) => {
        const selectedDate = new Date(date.getFullYear(), date.getMonth(), selectedDay);
        setSelectedDate(selectedDate);

        const dayLabel = format(selectedDate, 'EEEE');
        const day = days.find(day => day.label === dayLabel);

        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        if (onDateSelect) {
            onDateSelect({ date: formattedDate, day: day.id });
        } else {
            console.error('onDateSelect is not defined');
        }
    };

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const emptyDays = Array(firstDayIndex).fill(null);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const isPrevDisabled = date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    const isNextDisabled = date >= maxDate;

    return (
        <div className="w-[334px] mx-auto border rounded-xl drop-shadow-lg ">
            <header className="flex justify-between items-center mb-5 rounded-t-xl bg-indigo-500">
                <button className="flex items-center gap-2 px-4 py-2 text-lg text-white rounded">
                    {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    <Icon type="dropdown" />
                </button>
                <div className="flex gap-2 p-2">
                    <button onClick={handlePrevMonth} disabled={isPrevDisabled}><Icon type="prev" /></button>
                    <button onClick={handleNextMonth} disabled={isNextDisabled}><Icon type="next" /></button>
                </div>
            </header>
            <section className='p-2'>
                <div className="grid grid-cols-7 text-center mb-2 text-xs text-gray-800">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                        <div key={day}>{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 text-center gap-2">
                    {emptyDays.map((_, index) => <div key={`empty-${index}`} className="p-1.5" />)}
                    {daysArray.map(day => {
                        const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
                        const isDisabled = currentDate < today;
                        const isSelected = selectedDate && currentDate.toDateString() === selectedDate.toDateString();

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateSelect(day)}
                                disabled={isDisabled}
                                className={`p-1.5 rounded-full ${isSelected ? 'bg-green-500 text-white' :
                                    isDisabled ? 'text-gray-400' : 'hover:bg-indigo-50 text-stone-950'
                                    }`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default Calendar;