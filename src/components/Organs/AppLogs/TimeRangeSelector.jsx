import { useState } from "react";

const TimeRangeSelector = ({ timeFrom, timeTo, setTimeFrom, setTimeTo }) => {
    const [rawTimeFrom, setRawTimeFrom] = useState("09:00");
    const [rawTimeTo, setRawTimeTo] = useState("05:00");
    const [fromPeriod, setFromPeriod] = useState("AM");
    const [toPeriod, setToPeriod] = useState("PM");

    const formatTime = (value) => {
        let digits = value.replace(/\D/g, "");

        if (digits.length === 1) digits = `0${digits}00`;
        else if (digits.length === 2) digits = `${digits}00`;
        else if (digits.length === 3) digits = `0${digits}`;
        else digits = digits.slice(0, 4);

        const hours = digits.slice(0, 2);
        const minutes = digits.slice(2, 4);
        return `${hours}:${minutes}`;
    };

    const convertTo24Hour = (time, period) => {
        let [hour, minute] = time.split(":").map(Number);
        if (period === "PM" && hour < 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    };

    const handleBlur = (type, value) => {
        const formatted = formatTime(value);

        if (type === "from") {
            setRawTimeFrom(formatted);
            setTimeFrom(convertTo24Hour(formatted, fromPeriod));
        } else {
            setRawTimeTo(formatted);
            setTimeTo(convertTo24Hour(formatted, toPeriod));
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
