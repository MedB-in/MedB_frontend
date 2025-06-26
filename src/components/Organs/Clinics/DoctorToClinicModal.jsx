import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getDoctorList, addDoctorClinic } from "../../../services/doctors";
import { X } from "lucide-react";

const DoctorToClinicModal = ({ isOpen, closeModal, clinicId, onDoctorAdded }) => {
    const [doctorSearch, setDoctorSearch] = useState("");
    const [doctorResults, setDoctorResults] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFromDropdown, setSelectedFromDropdown] = useState(false);

    useEffect(() => {
        if (isOpen) resetForm();
    }, [isOpen]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (doctorSearch && !selectedFromDropdown) fetchDoctors(doctorSearch);
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [doctorSearch]);

    const fetchDoctors = async (search = "") => {
        try {
            const response = await getDoctorList(search);
            if (response?.data?.data) {
                setDoctorResults(response.data.data);
                setShowDropdown(true);
            } else {
                setDoctorResults([]);
                setShowDropdown(false);
                toast.error("Invalid doctor data received.");
            }
        } catch {
            setDoctorResults([]);
            toast.error("Failed to search doctors.");
        }
    };

    const resetForm = () => {
        setDoctorSearch("");
        setDoctorResults([]);
        setSelectedDoctor(null);
        setIsActive(true);
        setShowDropdown(false);
        setSelectedFromDropdown(false);
        setLoading(false);
    };

    const getDoctorDisplay = (doctor) => {
        if (!doctor) return "";
        return `${doctor.firstname} ${doctor.middlename || ""} ${doctor.lastname || ""} - ${doctor.speciality}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDoctor?.doctorid) return toast.error("Please select a doctor.");
        setLoading(true);
        try {
            await addDoctorClinic(clinicId, { doctorId: selectedDoctor.doctorid, isActive });
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-50">
                    <h2 className="text-xl font-semibold text-gray-800 mb-5 text-center">Add Doctor to Clinic</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <input
                                type="text"
                                value={selectedDoctor ? getDoctorDisplay(selectedDoctor) : doctorSearch}
                                onChange={(e) => {
                                    setDoctorSearch(e.target.value);
                                    setSelectedDoctor(null);
                                    setSelectedFromDropdown(false);
                                }}
                                onFocus={() => doctorResults.length > 0 && setShowDropdown(true)}
                                placeholder="Search by name or speciality"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {(doctorSearch || selectedDoctor) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setDoctorSearch("");
                                        setDoctorResults([]);
                                        setSelectedDoctor(null);
                                        setShowDropdown(false);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            )}

                            {showDropdown && doctorResults.length > 0 && (
                                <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                    {doctorResults.map((doctor) => (
                                        <li
                                            key={doctor.doctorId}
                                            onClick={() => {
                                                setSelectedDoctor(doctor);
                                                setDoctorSearch("");
                                                setDoctorResults([]);
                                                setShowDropdown(false);
                                                setSelectedFromDropdown(true);
                                            }}
                                            className="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-100"
                                        >
                                            {getDoctorDisplay(doctor)}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {showDropdown && doctorSearch.trim() && doctorResults.length === 0 && (
                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow px-4 py-2 text-sm text-gray-500">
                                    No matching doctors found.
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200"
                                onClick={() => {
                                    closeModal();
                                    resetForm();
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
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
