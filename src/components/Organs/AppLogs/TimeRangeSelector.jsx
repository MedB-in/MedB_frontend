import { useState } from "react";
import Swal from "sweetalert2";

const TimeRangeSelector = ({ setTimeFrom, setTimeTo }) => {
    const [rawTimeFrom, setRawTimeFrom] = useState("09:00");
    const [rawTimeTo, setRawTimeTo] = useState("05:00");
    const [fromPeriod, setFromPeriod] = useState("AM");
    const [toPeriod, setToPeriod] = useState("PM");

    const formatTime = (value) => {
        let digits = value.replace(/\D/g, "");

        if (digits.length === 0) return null;
        if (digits.length === 1) digits = `0${digits}00`;
        else if (digits.length === 2) digits = `${digits}00`;
        else if (digits.length === 3) digits = `0${digits}`;
        else digits = digits.slice(0, 4);

        let hours = digits.slice(0, 2);
        let minutes = digits.slice(2, 4);

        let hourNum = parseInt(hours, 10);
        let minuteNum = parseInt(minutes, 10);

        if (isNaN(hourNum) || isNaN(minuteNum) || hourNum < 1 || hourNum > 12 || minuteNum < 0 || minuteNum > 59) {
            return null;
        }

        return `${hourNum.toString().padStart(2, "0")}:${minuteNum.toString().padStart(2, "0")}`;
    };

    const convertTo24Hour = (time, period) => {
        let [hour, minute] = time.split(":").map(Number);
        if (period === "PM" && hour < 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    };

    const handleBlur = (type, value) => {
        const formatted = formatTime(value);

        if (!formatted) {
            Swal.fire({
                icon: 'warning',
                text: 'Please enter a valid time',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            if (type === "from") {
                setRawTimeFrom("01:00");
                setTimeFrom(convertTo24Hour("01:00", fromPeriod));
            } else {
                setRawTimeTo("01:00");
                setTimeTo(convertTo24Hour("01:00", toPeriod));
            }
            return;
        }

        const newFrom = type === "from" ? formatted : rawTimeFrom;
        const newTo = type === "to" ? formatted : rawTimeTo;

        const finalFrom = convertTo24Hour(newFrom, fromPeriod);
        const finalTo = convertTo24Hour(newTo, toPeriod);

        const fromMinutes = parseInt(finalFrom.split(":")[0]) * 60 + parseInt(finalFrom.split(":")[1]);
        const toMinutes = parseInt(finalTo.split(":")[0]) * 60 + parseInt(finalTo.split(":")[1]);

        if (fromMinutes >= toMinutes) {
            Swal.fire({
                icon: 'error',
                text: 'Invalid time range. "From" time must be before "To" time.',
                confirmButtonText: 'OK',
                confirmButtonColor: '#d33',
                allowOutsideClick: false,
                allowEscapeKey: false
            });

            if (type === "from") {
                setRawTimeFrom("01:00");
                setTimeFrom(convertTo24Hour("01:00", fromPeriod));
            } else {
                setRawTimeTo("01:00");
                setTimeTo(convertTo24Hour("01:00", toPeriod));
            }
            return;
        }

        if (type === "from") {
            setRawTimeFrom(formatted);
            setTimeFrom(finalFrom);
        } else {
            setRawTimeTo(formatted);
            setTimeTo(finalTo);
        }
    };

    const handlePeriodChange = (type, period) => {
        if (type === "from") {
            setFromPeriod(period);
            setTimeFrom(convertTo24Hour(rawTimeFrom, period));
        } else {
            setToPeriod(period);
            setTimeTo(convertTo24Hour(rawTimeTo, period));
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">From:</label>
                <input
                    type="text"
                    value={rawTimeFrom}
                    onChange={(e) => setRawTimeFrom(e.target.value)}
                    onBlur={(e) => handleBlur("from", e.target.value)}
                    placeholder="hh:mm"
                    className="border px-2 py-1 rounded w-[80px]"
                />
                <select
                    value={fromPeriod}
                    onChange={(e) => handlePeriodChange("from", e.target.value)}
                    className="border px-1 py-1 rounded text-sm"
                >
                    <option>AM</option>
                    <option>PM</option>
                </select>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">To:</label>
                <input
                    type="text"
                    value={rawTimeTo}
                    onChange={(e) => setRawTimeTo(e.target.value)}
                    onBlur={(e) => handleBlur("to", e.target.value)}
                    placeholder="hh:mm"
                    className="border px-2 py-1 rounded w-[80px]"
                />
                <select
                    value={toPeriod}
                    onChange={(e) => handlePeriodChange("to", e.target.value)}
                    className="border px-1 py-1 rounded text-sm"
                >
                    <option>AM</option>
                    <option>PM</option>
                </select>
            </div>
        </div>
    );
};

export default TimeRangeSelector;
