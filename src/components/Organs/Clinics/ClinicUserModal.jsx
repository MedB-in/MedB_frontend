import { useState } from "react";
import toast from "react-hot-toast";
import { addClinicUser } from "../../../services/clinics";
import InputField from "../../Atoms/Login/InputField";
import Button from "../../Atoms/Login/Button";
import { isValidName } from "../../../validation/validations";

const ClinicUserModal = ({ clinicId, onClose, onUserAdded }) => {

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        isVerified: false
    });
    const [loading, setLoading] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => {
            const updatedData = {
                ...prevData,
                [name]: type === "checkbox" ? checked : value
            };
            if (name === "password" || name === "confirmPassword") {
                setPasswordMatch(updatedData.password === updatedData.confirmPassword);
            }
            return updatedData;
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordMatch) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            if (!formData.firstName || !formData.email || !formData.password || !formData.confirmPassword) {
                toast.error("All fields are required.");
                return;
            }
            if (!isValidName(formData.firstName.trim())) {
                toast.error("First name must contain only letters or within 50 characters.");
                return;
            }
            if (formData.middleName && !isValidName(formData.middleName.trim())) {
                toast.error("Middle name must contain only letters or within 50 characters.");
                return;
            }
            if (formData.lastName && !isValidName(formData.lastName.trim())) {
                toast.error("Last name must contain only letters or within 50 characters.");
                return;
            }
            const response = await addClinicUser(clinicId, formData);
            toast.success(response.data.message);
            onUserAdded(response.data.data);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 px-4 overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg max-h-[90vh] w-full max-w-md overflow-y-auto my-4">
                <h2 className="text-xl font-semibold text-center mb-4">Add Clinic User</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                    <InputField type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                    <InputField type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                    <InputField type="email" name="email" placeholder="Email (Username)" value={formData.email} onChange={handleChange} required />
                    <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} toggleable required />
                    <InputField type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} toggleable required />

                    <div className="min-h-[1.5rem]">
                        {!passwordMatch && <p className="text-red-500 text-sm">Passwords do not match</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleChange} className="form-checkbox" />
                        <span>Verified</span>
                    </div>

                    <div className="flex justify-end space-x-4 pt-2">
                        <Button type="button" className="bg-gray-500 text-white" onClick={onClose} disabled={loading}>Cancel</Button>
                        <Button type="submit" className="bg-violet-600 text-white" disabled={loading}>
                            {loading ? "Adding..." : "Add User"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default ClinicUserModal;
