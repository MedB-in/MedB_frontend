import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import days from "../../../lib/slotDays";
import { addSlots, getDoctorClinic, getSlots, editSlot } from "../../../services/clinics";

const ClinicSlot = () => {
  const { clinicId, doctorId } = useParams();
  const [overlappingSlots, setOverlappingSlots] = useState([]);
  const [overlappingSlotsRes, setOverlappingSlotsRes] = useState([]);
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState("");
  const [timingFrom, setTimingFrom] = useState("");
  const [timingTo, setTimingTo] = useState("");
  const [slotGap, setSlotGap] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorClinic, setDoctorClinic] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [fromPeriod, setFromPeriod] = useState("AM");
  const [toPeriod, setToPeriod] = useState("AM");


  useEffect(() => {
    if (clinicId && doctorId) {
      fetchDoctorClinic();
      fetchSlots();
    }
  }, [clinicId, doctorId]);

  const fetchDoctorClinic = async () => {
    try {
      const data = await getDoctorClinic(clinicId, doctorId);
      setDoctorClinic(data.data.data || null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const fetchSlots = async () => {
    try {
      const data = await getSlots(clinicId, doctorId);
      setSlots(data?.data?.data || []);
    } catch (error) {
      setSlots([]);
      toast.error("Error fetching slots");
    }
  };

  const isOverlapping = (newFrom, newTo, existingSlots, editingSlot) => {
    return existingSlots.some((slot) => {
      const slotFrom = convertTo24Hour(slot.timingFrom, slot.fromPeriod);
      const slotTo = convertTo24Hour(slot.timingTo, slot.toPeriod);

      return (
        slot.doctorSlotId !== editingSlot?.doctorSlotId &&
        (
          (newFrom >= slotFrom && newFrom < slotTo) ||
          (newTo > slotFrom && newTo <= slotTo) ||
          (newFrom <= slotFrom && newTo >= slotTo)
        )
      );
    });
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setSelectedDay(slot.day.toString());

    const { formattedTime: fromTime, period: fromPeriodValue } = convertTo12Hour(slot.timingFrom);
    const { formattedTime: toTime, period: toPeriodValue } = convertTo12Hour(slot.timingTo);

    setTimingFrom(fromTime);
    setTimingTo(toTime);
    setFromPeriod(fromPeriodValue);
    setToPeriod(toPeriodValue);

    setSlotGap(slot.slotGap.toString());
  };

  const convertTo12Hour = (time) => {
    let [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return { formattedTime: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`, period };
  };

  const convertTo24Hour = (time, period) => {
    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const resetForm = () => {
    setSelectedDay("");
    setTimingFrom("");
    setTimingTo("");
    setSlotGap("");
    setEditingSlot(null);
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  };


  const handleSubmit = async () => {
    setLoading(true);
    if (!selectedDay || !timingFrom || !timingTo || !slotGap || !clinicId || !doctorId) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    const timingFrom24 = convertTo24Hour(timingFrom, fromPeriod);
    const timingTo24 = convertTo24Hour(timingTo, toPeriod);

    if (timingFrom24 >= timingTo24) {
      setErrorMessage("End time must be greater than start time.");
      setTimeout(() => setErrorMessage(null), 5000);
      setLoading(false);
      return;
    }

    const parsedDay = parseInt(selectedDay);

    const existingSlots = slots.filter(slot =>
      slot.day === parsedDay && slot.doctorSlotId !== editingSlot?.doctorSlotId
    );

    if (isOverlapping(timingFrom, timingTo, existingSlots, editingSlot)) {
      setOverlappingSlots(existingSlots.filter(slot => isOverlapping(timingFrom, timingTo, [slot], editingSlot)));
      setErrorMessage("Overlapping slots detected within the clinic. Please adjust the time.");
      setLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
        setOverlappingSlots([]);
      }, 5000);
      return;
    }

    const newSlot = {
      clinicId,
      doctorId,
      day: parsedDay,
      timingFrom,
      timingTo,
      slotGap: parseInt(slotGap),
    };

    try {
      let response;

      if (editingSlot) {
        response = await editSlot(editingSlot.doctorSlotId, newSlot);
      } else {
        response = await addSlots(newSlot);
      }

      if (response.data.status === "success") {
        setSlots(prevSlots => {
          if (editingSlot) {
            return prevSlots.map(slot =>
              slot.doctorSlotId === editingSlot.doctorSlotId ? { ...newSlot, doctorSlotId: editingSlot.doctorSlotId } : slot
            );
          } else {
            return [...prevSlots, { ...newSlot, doctorSlotId: response?.data?.data?.doctorSlotId }];
          }
        });

        resetForm();
        setTimingFrom("");
        setTimingTo("");
        setSlotGap("");
        setSelectedDay("");
        setOverlappingSlots([]);
        setOverlappingSlotsRes([]);
        setLoading(false);
        toast.success(response.data.message || "Slot added successfully");
      } else {
        setLoading(false);
        toast.error(response.message || "Failed to add slot.");
      }
    } catch (error) {
      setLoading(false);
      setOverlappingSlotsRes(error.response?.data?.overlappingSlots);
      setTimeout(() => setOverlappingSlotsRes([]), 10000);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const groupedSlots = useMemo(() => {
    return days.map(day => ({
      ...day,
      slots: slots.filter(slot => slot.day === day.id).sort((a, b) => a.timingFrom.localeCompare(b.timingFrom)),
    }));
  }, [slots]);

  return (
    <div className="p-5">
      <button
        className="bg-gray-200 text-gray-700 px-4 py-2 my-5 rounded-md hover:bg-gray-300"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      {doctorClinic && (
        <div className="flex-1 bg-white/70 backdrop-blur-md p-6 rounded-xl shadow-md border border-gray-200 flex items-center gap-6">
          <div className="flex items-center gap-4 w-1/2">
            <img
              src={doctorClinic.doctor.profilePicture}
              alt={doctorClinic.doctor.firstName}
              className="w-16 h-16 rounded-full border border-gray-300 object-cover shadow-sm"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                Dr. {doctorClinic.doctor.firstName} {doctorClinic.doctor.lastName}
              </h2>
              <p className="text-gray-700 text-sm capitalize">
                {doctorClinic.doctor.speciality} | {doctorClinic.doctor.qualifications}
              </p>
              <p className="text-gray-600 text-xs">Experience: {doctorClinic.doctor.experience} years</p>
              <p className="text-gray-600 text-xs">{doctorClinic.doctor.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 w-1/2">
            <img
              src={doctorClinic.clinic.clinicPicture}
              alt={doctorClinic.clinic.clinicName}
              className="w-16 h-16 rounded-lg border border-gray-300 object-cover shadow-sm"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{doctorClinic.clinic.clinicName}</h2>
              <p className="text-gray-700 text-sm">{doctorClinic.clinic.address}</p>
              <p className="text-gray-600 text-xs flex items-center gap-1">
                📍 {doctorClinic.clinic.city}, {doctorClinic.clinic.state}, {doctorClinic.clinic.country} - {doctorClinic.clinic.postalCode}
              </p>
              <div className="flex flex-wrap gap-3 mt-1 text-gray-700 text-xs">
                <p className="flex items-center gap-2">📞 {doctorClinic.clinic.contact}</p>
                <p className="flex items-center gap-2">✉️ {doctorClinic.clinic.email}</p>
                {doctorClinic.clinic.website && (
                  <a
                    href={doctorClinic.clinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-all flex items-center gap-1 font-medium"
                  >
                    🌐 Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Manage Doctor Slots</h3>
          <label className="block mb-2 text-sm font-medium text-gray-700">Select a Day</label>
          <select
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)} disabled={editingSlot}
          >
            <option value="">Select from the List</option>
            {days.map(day => <option key={day.id} value={day.id}>{day.label}</option>)}
          </select>
          <div className="flex gap-4 mt-4">
            {/* From Time Selection */}
            <div className="flex flex-col w-full">
              <label className="text-gray-700 font-medium mb-1">From</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={timingFrom}
                  onChange={(e) => setTimingFrom(e.target.value)}
                />
                <select
                  className="p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={fromPeriod}
                  onChange={(e) => setFromPeriod(e.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* To Time Selection */}
            <div className="flex flex-col w-full">
              <label className="text-gray-700 font-medium mb-1">To</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={timingTo}
                  onChange={(e) => setTimingTo(e.target.value)}
                />
                <select
                  className="p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={toPeriod}
                  onChange={(e) => setToPeriod(e.target.value)}
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>


          <input
            type="number"
            className="w-full p-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none mt-4"
            placeholder="Slot Gap (mins)"
            value={slotGap}
            onChange={(e) => setSlotGap(e.target.value)}
          />
          <button
            className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300"
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : editingSlot ? "Update Slot" : "Save"}
          </button>
          {editingSlot && (
            <button
              className="mt-2 w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-semibold transition-all duration-300"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
          {errorMessage && (
            <div className="mt-3 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}
          {overlappingSlotsRes?.length > 0 && (
            <div className="mt-3 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
              <p>Overlapping slots found:</p>
              <ul className="mt-2">
                {overlappingSlotsRes?.map(slot => (
                  <li key={slot?.doctorSlotId} className="text-gray-700">
                    🕒 {slot?.timingFrom} - {slot?.timingTo} (Gap: {slot.slotGap} mins)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Scheduled Slots</h3>
          {groupedSlots.map((day, dayIndex) => (
            day.slots.length > 0 && (
              <div key={`day-${day.id || dayIndex}`} className="mt-5 p-4 border-l-4 rounded-lg"
                style={{ borderColor: overlappingSlots.some(slot => slot.day === day.id) ? 'red' : '#3b82f6' }}>
                <h4 className={`font-semibold ${overlappingSlots.some(slot => slot.day === day.id) ? 'text-red-700' : 'text-blue-700'}`}>
                  {day.label}
                </h4>
                {day.slots.map((slot, slotIndex) => (
                  <div key={`slot-${slot.doctorSlotId || slotIndex}`} className="flex justify-between items-center">
                    <p className={`text-sm ${overlappingSlots.some(overlap => overlap.doctorSlotId === slot.doctorSlotId) ? 'text-red-700' : 'text-gray-700'}`}>
                      🕒  {formatTime(slot.timingFrom)} - {formatTime(slot.timingTo)} <span className="text-gray-500">(Gap: {slot.slotGap} mins)</span>
                    </p>
                    <button
                      className="text-yellow-500 px-3 py-1 rounded-md text-xs hover:text-yellow-600"
                      onClick={() => handleEdit(slot)}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            )
          ))}
        </div>


      </div>
    </div>
  );
};

export default ClinicSlot;
