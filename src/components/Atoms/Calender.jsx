import React, { useState, useEffect, useRef } from 'react';
import days from '../../lib/slotDays';
import { format } from 'date-fns';
import dropdown from '../../assets/images/dropdown.png';
import prev from '../../assets/images/prev-icon.png';
import next from '../../assets/images/next-icon.png';
import toast from 'react-hot-toast';

const Icon = ({ type }) => {
    const icons = { dropdown, prev, next };
    return <img src={icons[type]} alt={type} width={17} height={17} style={{ cursor: 'pointer' }} />;
};

const Calendar = ({ onDateSelect }) => {
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 31);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
            toast.error('Date is not defined');
        }
    };

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const emptyDays = Array(firstDayIndex).fill(null);
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const isPrevDisabled = date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    const isNextDisabled = date >= maxDate;

    const allowedMonths = Array.from({ length: 4 }, (_, i) => new Date(today.getFullYear(), today.getMonth() + i));

    return (
        <div className="w-full max-w-[334px] mx-auto border rounded-xl drop-shadow-lg">
            <header className="flex justify-between items-center mb-5 rounded-t-xl bg-indigo-500 p-4 sm:p-2">
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setShowDropdown((prev) => !prev)} className="flex items-center gap-2 text-lg text-white rounded">
                        {format(date, 'MMMM yyyy')}
                        <Icon type="dropdown" />
                    </button>
                    {showDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-44 bg-white border rounded shadow-lg z-10">
                            {allowedMonths.map((m, index) => (
                                <button
                                    key={index}
                                    onClick={() => { setDate(m); setShowDropdown(false); }}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    {m.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} disabled={isPrevDisabled} className={isPrevDisabled ? 'opacity-50 cursor-not-allowed' : ''}><Icon type="prev" /></button>
                    <button onClick={handleNextMonth} disabled={isNextDisabled} className={isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}><Icon type="next" /></button>
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
                                className={`p-1.5 rounded-full w-10 h-10 sm:w-8 sm:h-8 ${isSelected ? 'bg-green-500 text-white' :
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
