import React, { useEffect } from "react";
import StarIcon from "../../../assets/images/prescritpion/star-icon.svg";
import RemoveMedIcon from "../../../assets/images/prescritpion/remove-med-icon.svg";
import AddIcon from "../../../assets/images/prescritpion/add-med.svg";
import toast from "react-hot-toast";

const frequencyOptions = ["Morning", "Noon", "Evening", "Night"];

const Medicines = ({ medicinesData, setMedicinesData }) => {

  const handleInputChange = (index, field, value) => {
    const updated = medicinesData.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setMedicinesData(updated);
  };

  const addMedicine = () => {
    const last = medicinesData[medicinesData.length - 1];

    const isComplete =
      last.medicineName.trim() &&
      last.dosage.trim() &&
      last.frequency.trim() &&
      last.duration.trim();

    if (!isComplete) {
      toast.error("Please complete the current medicine before adding a new one.");
      return;
    }

    setMedicinesData([
      ...medicinesData,
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        remarks: "",
      },
    ]);
  };

  const removeMedicine = (index) => {
    if (medicinesData.length === 1) return;
    const updated = medicinesData.filter((_, i) => i !== index);
    setMedicinesData(updated);
  };

  return (
    <div className="flex flex-col w-full shadow-md rounded-lg pt-1 pb-5 bg-white">
      <div className="bg-[#6F64E7] text-white text-sm font-semibold uppercase rounded-t-lg px-6 py-4">
        <div className="grid grid-cols-[1fr_120px_160px_120px_1fr_40px] items-center gap-4">
          <div>Medicine</div>
          <div>Dosage</div>
          <div>Frequency</div>
          <div>Duration</div>
          <div>Remarks</div>
          <div></div>
        </div>
      </div>

      <div className="px-6 mt-4 space-y-4">
        {medicinesData.map((med, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_120px_160px_120px_1fr_40px] items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <img src={StarIcon} className="w-5 h-5" alt="Star" />
              <input
                type="text"
                placeholder="Medicine name"
                value={med.medicineName}
                onChange={(e) => handleInputChange(index, "medicineName", e.target.value)}
                className="w-full px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
              />
            </div>

            <input
              type="text"
              placeholder="Dosage"
              value={med.dosage}
              onChange={(e) => handleInputChange(index, "dosage", e.target.value)}
              className="px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
            />

            <select
              value={med.frequency}
              onChange={(e) => handleInputChange(index, "frequency", e.target.value)}
              className="px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
            >
              <option value="">Select</option>
              {frequencyOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Duration"
              value={med.duration}
              onChange={(e) => handleInputChange(index, "duration", e.target.value)}
              className="px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
            />

            <input
              type="text"
              placeholder="Remarks"
              value={med.remarks}
              onChange={(e) => handleInputChange(index, "remarks", e.target.value)}
              className="w-full px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
            />

            <button onClick={() => removeMedicine(index)} className="w-6 h-6">
              <img src={RemoveMedIcon} alt="Remove" className="w-full h-full" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addMedicine}
        className="flex items-center gap-1 text-xs text-white font-medium bg-[#86CFC3] rounded-md px-3 py-1 mt-4 ml-6 w-fit shadow-inner"
      >
        <img src={AddIcon} className="w-3 h-3" alt="Add icon" />
        <span>Add Medicine</span>
      </button>
    </div>
  );
};

export default Medicines;
