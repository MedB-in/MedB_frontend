import React, { useState, useEffect, useRef } from 'react';

const DigitBox = ({ digit }) => (
  <div className="bg-black text-white w-10 h-14 rounded-lg flex items-center justify-center text-4xl font-mono shadow-lg relative overflow-auto">
    <div className="absolute top-0 left-0 w-full h-1/2 bg-neutral-800 opacity-50"></div>
    <span className="z-10">{digit}</span>
  </div>
);

const CountdownTimer = ({ initialMinutes = 0, initialSeconds = 0, onComplete }) => {
  const validInitialSeconds = initialSeconds % 60;
  const additionalMinutesFromSeconds = Math.floor(initialSeconds / 60);
  const validInitialMinutes = initialMinutes + additionalMinutesFromSeconds;

  const [time, setTime] = useState({
    minutes: validInitialMinutes,
    seconds: validInitialSeconds,
  });
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning && (time.minutes > 0 || time.seconds > 0)) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime.seconds > 0) {
            return { ...prevTime, seconds: prevTime.seconds - 1 };
          } else if (prevTime.minutes > 0) {
            return { minutes: prevTime.minutes - 1, seconds: 59 };
          } else {
            clearInterval(intervalRef.current);
            setIsTimerRunning(false);
            if (onComplete && typeof onComplete === 'function') {
              onComplete();
            }
            return { minutes: 0, seconds: 0 };
          }
        });
      }, 1000);
    } else if (time.minutes === 0 && time.seconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (onComplete && typeof onComplete === 'function') {
        onComplete();
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [time.minutes, time.seconds, isTimerRunning, onComplete]);

  const formatTime = (value) => value.toString().padStart(2, '0');

  const minutesTens = formatTime(time.minutes)[0] || '0';
  const minutesOnes = formatTime(time.minutes)[1] || '0';
  const secondsTens = formatTime(time.seconds)[0] || '0';
  const secondsOnes = formatTime(time.seconds)[1] || '0';

  const restartTimer = () => {
    setTime({
      minutes: validInitialMinutes,
      seconds: validInitialSeconds,
    });
    setIsTimerRunning(true);
  };

  return (
    <div className="flex flex-col items-center">
      {!isTimerRunning && (time.minutes === 0 && time.seconds === 0) && (
        <button
          onClick={restartTimer}
          className="mb-4 px-2 bg-[rgba(134,207,195,0.2)] text-gray-800 rounded hover:bg-blue-600"
        >
          Restart Timer
        </button>
      )}
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-4 bg-gray-200 rounded-xl shadow-xl">
        <DigitBox digit={minutesTens} />
        <DigitBox digit={minutesOnes} />
        <span className="text-3xl sm:text-6xl md:text-5xl font-mono text-black">:</span>
        <DigitBox digit={secondsTens} />
        <DigitBox digit={secondsOnes} />
      </div>
    </div>
  );
};

export default CountdownTimer;