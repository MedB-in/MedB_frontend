import { useState } from "react";
import toast from "react-hot-toast";
import { addClinicUser } from "../../../services/clinics";
import InputField from "../../Atoms/Login/InputField";
import Button from "../../Atoms/Login/Button";

const ClinicUserModal = ({ clinicId, onClose, onUserAdded }) => {

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };
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
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
                toast.error("All fields are required.");
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-center mb-4">Add Clinic User</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                    <InputField type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                    <InputField type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                    <InputField type="email" name="email" placeholder="Email (Username)" value={formData.email} onChange={handleChange} required />
                    <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} toggleable required />
                    <InputField type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} toggleable required />
                    <div className="min-h-[1.5rem]">
                        {!passwordMatch && <p className="text-red-500 text-sm">Passwords do not match</p>}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Button type="button" className="bg-gray-500 text-white" onClick={onClose}>Cancel</Button>
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
