import React, { useRef } from "react";
import StarIcon from "../../../assets/images/prescritpion/star-icon.svg";
import RemoveMedIcon from "../../../assets/images/prescritpion/remove-med-icon.svg";
import AddIcon from "../../../assets/images/prescritpion/add-med.svg";
import toast from "react-hot-toast";

const Medicines = ({ medicinesData, setMedicinesData }) => {
  const inputRefs = useRef([]);

  const handleInputChange = (index, field, value) => {
    if (field === "frequency") {
      let cleaned = value.replace(/[^01-]/g, "");
      let digits = cleaned.replace(/-/g, "");
      digits = digits.slice(0, 3);
      let formatted = "";
      for (let i = 0; i < digits.length; i++) {
        formatted += digits[i];
        if (i < 2) {
          formatted += "-";
        }
      }
      if (digits.length < 3 && formatted.endsWith("-")) {
        formatted = formatted.slice(0, -1);
      }

      value = formatted;
    }

    const updated = medicinesData.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setMedicinesData(updated);
  };



  const handleKeyDown = (e, index, field) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (field === "frequency") {
        const freq = medicinesData[index].frequency;
        if (!/^([01]-){2}[01]$/.test(freq)) {
          toast.error("Frequency must be in format like 1-0-1");
          return;
        }
      }

      const fields = ["medicineName", "dosage", "frequency", "duration", "remarks"];
      const fieldIndex = fields.indexOf(field);

      if (fieldIndex < fields.length - 1) {
        const nextField = fields[fieldIndex + 1];
        const nextInput = inputRefs.current[`${index}-${nextField}`];
        if (nextInput) nextInput.focus();
      } else {
        const currentMed = medicinesData[index];
        const isComplete =
          currentMed.medicineName.trim() &&
          currentMed.dosage.trim() &&
          /^([01]-){2}[01]$/.test(currentMed.frequency) &&
          currentMed.duration.trim();

        if (!isComplete) {
          toast.error("Please complete the current medicine before adding a new one.");
          return;
        }

        setMedicinesData([
          ...medicinesData,
          { medicineName: "", dosage: "", frequency: "", duration: "", remarks: "" },
        ]);

        setTimeout(() => {
          const newIndex = medicinesData.length;
          const nextInput = inputRefs.current[`${newIndex}-medicineName`];
          if (nextInput) nextInput.focus();
        }, 0);
      }
    }
  };


  const addMedicine = () => {
    const last = medicinesData[medicinesData.length - 1];
    const isComplete =
      last.medicineName.trim() &&
      last.dosage.trim() &&
      /^([01]-){2}[01]$/.test(last.frequency) &&
      last.duration.trim();

    if (!isComplete) {
      toast.error("Please complete the current medicine before adding a new one.");
      return;
    }

    setMedicinesData([
      ...medicinesData,
      { medicineName: "", dosage: "", frequency: "", duration: "", remarks: "" },
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
                onKeyDown={(e) => handleKeyDown(e, index, "medicineName")}
                ref={(el) => (inputRefs.current[`${index}-medicineName`] = el)}
                className="w-full px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
              />
            </div>

            <input
              type="text"
              placeholder="Dosage"
              value={med.dosage}
              onChange={(e) => handleInputChange(index, "dosage", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index, "dosage")}
              ref={(el) => (inputRefs.current[`${index}-dosage`] = el)}
              className="px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
            />

            <input
              type="text"
              placeholder="(e.g. 1-0-1)"
              value={med.frequency}
              onChange={(e) => handleInputChange(index, "frequency", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index, "frequency")}
              ref={(el) => (inputRefs.current[`${index}-frequency`] = el)}
              className="px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
              maxLength={5}
            />

            <input
              type="text"
              placeholder="Duration"
              value={med.duration}
              onChange={(e) => handleInputChange(index, "duration", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index, "duration")}
              ref={(el) => (inputRefs.current[`${index}-duration`] = el)}
              className="px-3 py-2 rounded-md border bg-[rgba(134,207,195,0.2)] border-gray-300"
            />

            <input
              type="text"
              placeholder="Remarks"
              value={med.remarks}
              onChange={(e) => handleInputChange(index, "remarks", e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index, "remarks")}
              ref={(el) => (inputRefs.current[`${index}-remarks`] = el)}
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
