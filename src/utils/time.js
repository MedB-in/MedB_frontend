import { format } from "date-fns";

const getISTDate = () => {
    const now = new Date();
    // console.log(now + " " + now.getTimezoneOffset() + "Server/UTC");

    const localOffsetMs = now.getTimezoneOffset() * 60 * 1000;
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffsetMs + localOffsetMs);
    // console.log(istTime + " " + istTime.getTimezoneOffset() + "converted IST");

    return format(istTime, "yyyy-MM-dd");
};

const isPastSlot = (slotTime, selectedDate) => {
    const nowUTC = new Date();
    const nowIST = new Date(nowUTC.getTime() + (5.5 * 60 * 60 * 1000));
    const [slotHour, slotMinute] = slotTime.split(':').map(Number);
    const slotDateIST = new Date(selectedDate);
    slotDateIST.setHours(slotHour, slotMinute, 0, 0);
    const slotDateISTAdjusted = new Date(slotDateIST.getTime() - (slotDateIST.getTimezoneOffset() * 60000));
    return slotDateISTAdjusted < nowIST;
};

export { getISTDate, isPastSlot };