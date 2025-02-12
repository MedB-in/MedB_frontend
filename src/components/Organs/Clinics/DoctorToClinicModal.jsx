import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getDoctorList, addDoctorClinic } from "../../../services/doctors";

const DoctorToClinicModal = ({ isOpen, closeModal, clinicId, onDoctorAdded }) => {
    const [doctorList, setDoctorList] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
        } else {
            resetForm();
        }
    }, [isOpen]);

    const fetchDoctors = async () => {
        try {
            const response = await getDoctorList();
            if (response?.data?.data) {
                setDoctorList(response.data.data);
            } else {
                toast.error("Invalid doctor data received.");
            }
        } catch (error) {
            toast.error("Failed to load doctors.");
        }
    };

    const resetForm = () => {
        setSelectedDoctor("");
        setIsActive(true);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDoctor) {
            toast.error("Please select a doctor.");
            return;
        }

        setLoading(true);
        try {
            await addDoctorClinic(clinicId, { doctorId: selectedDoctor, isActive });
            toast.success("Doctor added successfully!");
            onDoctorAdded();
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-40">
                <div className="bg-white p-6 rounded-md shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">Add Doctor to Clinic</h3>
                    <form onSubmit={handleSubmit}>
                        {/* Doctor Selection Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Select Doctor</label>
                            <select
                                value={selectedDoctor}
                                onChange={(e) => setSelectedDoctor(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="" disabled>Select a doctor</option>
                                {doctorList.map((doctor) => (
                                    <option key={doctor.doctorId} value={doctor.doctorId}>
                                        {doctor.firstName} {doctor.middleName} {doctor.lastName} - {doctor.speciality} ({doctor.qualifications})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Active Status Checkbox */}
                        {/* <div className="mb-4 flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                                className="form-checkbox"
                            />
                            <span>Active</span>
                        </div> */}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={() => {
                                    closeModal();
                                    resetForm();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-500 text-white rounded-md"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Add Doctor"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default DoctorToClinicModal;
