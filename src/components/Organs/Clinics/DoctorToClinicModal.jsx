import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const DoctorModal = ({ isOpen, closeModal, doctorData, onSubmit }) => {
    const [formData, setFormData] = useState({
        doctorId: "",
        name: "",
        specialization: "",
        experience: "",
        contact: "",
        isActive: true,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (doctorData) {
            setFormData({
                ...formData,
                ...doctorData,
            });
        }
    }, [doctorData]);

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.specialization || !formData.contact) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData);
            closeModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        isOpen && (
            <div
                className="fixed inset-0  flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
                aria-hidden={!isOpen}
                role="dialog"
            >
                <div className="bg-white p-6 rounded-md shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-xl font-semibold mb-4">{doctorData ? "Slot management currently not available" : "Add New Doctor currently not available"}</h3>
                    {/*<h3 className="text-xl font-semibold mb-4">{doctorData ? "Edit Doctor" : "Add New Doctor"}</h3>
                     <form onSubmit={handleFormSubmit}>
                        {[
                            { label: "Doctor Name", name: "name", type: "text" },
                            { label: "Specialization", name: "specialization", type: "text" },
                            { label: "Experience (years)", name: "experience", type: "number" },
                            { label: "Contact", name: "contact", type: "text" },
                        ].map(({ label, name, type }) => (
                            <div className="mb-4" key={name}>
                                <label className="block text-sm font-medium">{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        ))}

                        <div className="mb-4 flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="form-checkbox"
                            />
                            <span>Active</span>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button type="button" className="px-4 py-2 bg-gray-300 rounded-md" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-md" disabled={loading}>
                                {loading ? "Processing..." : doctorData ? "Update Doctor" : "Add Doctor"}
                            </button>
                        </div>
                    </form> */}
                    <button type="button" className="px-4 py-2 bg-gray-300 rounded-md" onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    );
};

export default DoctorModal;
