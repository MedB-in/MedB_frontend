import { useState } from "react";
import toast from "react-hot-toast";
import { addPatient } from "../../../services/patient";
import InputField from "../../Atoms/Login/InputField";
import Button from "../../Atoms/Login/Button";

const AddPatientModal = ({ onClose, onPatientAdded, clinicId }) => {
    const [formData, setFormData] = useState({
        clinicId: clinicId,
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        contactNo: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.email || !formData.contactNo) {
            toast.error("All fields are required.");
            return;
        }
        setLoading(true);
        try {
            const response = await addPatient(formData);
            toast.success(response.data.message);
            console.log(response.data.data);
            onPatientAdded(response.data.data);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Add Patient</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                    <InputField type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                    <InputField type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                    <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <InputField type="text" name="contactNo" placeholder="Contact No" value={formData.contactNo} onChange={handleChange} required />
                    <div className="flex justify-end space-x-4">
                        <Button type="button" className="bg-gray-500 text-white" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-violet-600 text-white" disabled={loading}>
                            {loading ? "Adding..." : "Add Patient"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatientModal;
