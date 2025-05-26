import React, { useState, useEffect } from "react";
import RemoveIcon from "../../../assets/images/prescritpion/remove.svg";
import AddIcon from "../../../assets/images/prescritpion/add-icon.svg";
import toast from "react-hot-toast";

const Complaints = ({ complaints, setComplaints }) => {
    const addComplaint = () => {
        const lastComplaint = complaints[complaints.length - 1];
        const isLastComplete =
            lastComplaint &&
            lastComplaint.problem.trim() !== "" &&
            lastComplaint.duration.trim() !== "";

        if (!isLastComplete) {
            toast.error("Please complete the current complaint before adding a new one.");
            return;
        }

        setComplaints([
            ...complaints,
            {
                problem: "",
                duration: "",
            },
        ]);
    };

    const removeComplaint = (index) => {
        const updated = complaints.filter((_, i) => i !== index);
        setComplaints(updated);
    };

    const updateComplaint = (index, field, value) => {
        const updated = complaints.map((complaint, i) =>
            i === index ? { ...complaint, [field]: value } : complaint
        );
        setComplaints(updated);
    };

    return (
        <div className="flex flex-col w-full shadow-md rounded-lg pt-1 pb-5 bg-white">
            <div className="bg-[#6F64E7] text-white text-sm font-semibold uppercase rounded-t-lg px-6 py-4">
                <div className="grid grid-cols-[1fr_1fr_40px] items-center gap-4">
                    <div>Problems/Issues</div>
                    <div>Duration</div>
                    <div></div>
                </div>
            </div>

            <div className="px-6 mt-4 space-y-4">
                {complaints.map((complaint, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-[1fr_1fr_40px] items-center gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Enter Problems/Issues"
                            className="h-[50px] px-4 rounded-md bg-[rgba(134,207,195,0.2)] shadow"
                            value={complaint.problem}
                            onChange={(e) =>
                                updateComplaint(index, "problem", e.target.value)
                            }
                        />
                        <input
                            type="text"
                            placeholder="Enter Duration"
                            className="h-[50px] px-4 rounded-md bg-[rgba(134,207,195,0.2)] shadow"
                            value={complaint.duration}
                            onChange={(e) =>
                                updateComplaint(index, "duration", e.target.value)
                            }
                        />
                        <button
                            className="w-6 h-6"
                            onClick={() => removeComplaint(index)}
                            disabled={complaints.length === 1} // prevent removing last complaint
                        >
                            <img
                                src={RemoveIcon}
                                alt="Remove"
                                className="w-full h-full"
                            />
                        </button>
                    </div>
                ))}
            </div>

            <button
                className="flex items-center gap-1 text-sm text-[#6F64E7] font-medium px-6 mt-4"
                onClick={addComplaint}
            >
                <img src={AddIcon} className="w-4 h-4" alt="Add icon" />
                <span>Add</span>
            </button>
        </div>
    );
};

export default Complaints;
