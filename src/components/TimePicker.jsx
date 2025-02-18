import React, { useState } from 'react';

const CustomTimePicker = ({
  onChange,
  value,
  onChangePeriod,
  valuePeriod
}) => {
  const [hours, setHours] = useState(value.split(":")[0]);
  const [minutes, setMinutes] = useState(value.split(":")[1]);
  const [period, setPeriod] = useState(valuePeriod);

  const handleHourChange = (e) => {
    setHours(e.target.value);
    onChange(`${e.target.value}:${minutes} ${period}`);
  };

  const handleMinuteChange = (e) => {
    setMinutes(e.target.value);
    onChange(`${hours}:${e.target.value} ${period}`);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
    onChange(`${hours}:${minutes} ${e.target.value}`);
    onChangePeriod(e.target.value);
  };

  return (
    <div className="flex gap-4 bg-white rounded-2xl p-4 shadow-md">
      <select
        value={hours}
        onChange={handleHourChange}
        className="py-2 px-4 rounded-lg border border-gray-200 text-gray-600"
      >
        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <select
        value={minutes}
        onChange={handleMinuteChange}
        className="py-2 px-4 rounded-lg border border-gray-200 text-gray-600"
      >
        {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')).map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
      <select
        value={period}
        onChange={handlePeriodChange}
        className="py-2 px-4 rounded-lg border border-gray-200 text-gray-600"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

export default CustomTimePicker;