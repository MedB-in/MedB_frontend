import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { addPatient, updatePatient } from "../../../services/patient";
import InputField from "../../Atoms/Login/InputField";
import Button from "../../Atoms/Login/Button";
import { isValidAge, isValidEmail, isValidName, isValidPhone, isValidPincode } from "../../../validation/validations";

const PatientModal = ({ onClose, onPatientAdded, onPatientUpdated, clinicId, patient, isUpdate }) => {
    const [formData, setFormData] = useState({
        clinicId,
        firstName: "",
        middleName: "",
        lastName: "",
        age: "",
        gender: "",
        careOfRelation: "",
        careOfName: "",
        email: "",
        contactNo: "",
        address: "",
        city: "",
        district: "",
        state: "",
        country: "",
        postalCode: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isUpdate && patient) {
            setFormData({
                clinicId,
                userId: patient.userId || "",
                firstName: patient.firstName ?? "",
                middleName: patient.middleName ?? "",
                lastName: patient.lastName ?? "",
                age: patient.age ?? "",
                gender: patient.gender ?? "",
                careOfRelation: patient.careOfRelation ?? "",
                careOfName: patient.careOfName ?? "",
                email: patient.email ?? "",
                contactNo: patient.contactNo ?? "",
                address: patient.address ?? "",
                city: patient.city ?? "",
                district: patient.district ?? "",
                state: patient.state ?? "",
                country: patient.country ?? "",
                postalCode: patient.postalCode ?? "",
            });
        }
    }, [isUpdate, patient, clinicId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.firstName || !formData.email || !formData.contactNo) {
            toast.error("All required fields must be filled.");
            return;
        }
        if (!isValidName(formData.firstName.trim())) {
            toast.error("First name must contain only letters.");
            return;
        }
        if (formData.middleName && !isValidName(formData.middleName.trim())) {
            toast.error("Middle name must contain only letters.");
            return;
        }
        if (formData.lastName && !isValidName(formData.lastName.trim())) {
            toast.error("Last name must contain only letters.");
            return;
        }
        if(!isValidAge(formData.age)) {
            toast.error("Please enter a valid age.");
            return;
        }
        if (!isValidEmail(formData.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        if (!isValidPhone(formData.contactNo)) {
            toast.error("Please enter a valid Indian phone number.");
            return;
        }
        if (!isValidPincode(formData.postalCode)) {
            toast.error("Please enter a valid pincode.");
            return;
        }
        if(!isValidName(formData.country)) {
            toast.error("Please enter a valid country.");
            return;
        }
        setLoading(true);
        try {
            let response;
            if (isUpdate) {
                response = await updatePatient(formData);
                toast.success(response.data.message);
                onPatientUpdated(formData);
            } else {
                response = await addPatient(formData);
                toast.success(response.data.message);
                onPatientAdded(response.data.data);
            }
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[100] p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl border border-white/30 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                    {isUpdate ? "Update Patient" : "Add Patient"}
                </h2>
                <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
                    <InputField type="text" name="firstName" placeholder="First Name*" value={formData.firstName} onChange={handleChange} required />
                    <InputField type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                    <InputField type="text" name="lastName" placeholder="Last Name*" value={formData.lastName} onChange={handleChange} required />
                    <InputField type="number" name="age" placeholder="Age*" value={formData.age} onChange={handleChange} required />
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white/30 backdrop-blur-md" required>
                        <option value="" disabled>Select Gender*</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <select name="careOfRelation" value={formData.careOfRelation} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white/30 backdrop-blur-md">
                        <option value="" disabled>Select Care Of</option>
                        {["Father of", "Mother of", "Son of", "Daughter of", "Husband of", "Wife of", "Brother of", "Sister of", "Guardian of", "Other"].map((relation) => (
                            <option key={relation} value={relation}>{relation}</option>
                        ))}
                    </select>
                    <InputField type="text" name="careOfName" placeholder="Care Of Name" value={formData.careOfName} onChange={handleChange} disabled={!formData.careOfRelation} />
                    <InputField type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleChange} {...(isUpdate ? { disabled: true } : { required: true })} />
                    <InputField type="text" name="contactNo" placeholder="Contact No*" value={formData.contactNo} onChange={handleChange} required />
                    <InputField type="text" name="address" placeholder="Address*" value={formData.address} onChange={handleChange} required />
                    <InputField type="text" name="city" placeholder="City*" value={formData.city} onChange={handleChange} required />
                    <InputField type="text" name="district" placeholder="District*" value={formData.district} onChange={handleChange} required />
                    <InputField type="text" name="state" placeholder="State*" value={formData.state} onChange={handleChange} required />
                    <InputField type="text" name="country" placeholder="Country*" value={formData.country} onChange={handleChange} required />
                    <InputField type="text" name="postalCode" placeholder="Postal Code*" value={formData.postalCode} onChange={handleChange} required />
                    <div className="col-span-full flex justify-end space-x-4">
                        <Button type="button" className="bg-gray-500 text-white" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-violet-600 text-white" disabled={loading}>
                            {loading ? (isUpdate ? "Updating..." : "Adding...") : (isUpdate ? "Update" : "Add Patient")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PatientModal;