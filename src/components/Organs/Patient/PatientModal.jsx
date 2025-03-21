import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { addPatient, updatePatient } from "../../../services/patient";
import InputField from "../../Atoms/Login/InputField";
import Button from "../../Atoms/Login/Button";

const PatientModal = ({ onClose, onPatientAdded, onPatientUpdated, clinicId, patient, isUpdate }) => {
    const [formData, setFormData] = useState({
        clinicId: clinicId,
        firstName: "",
        middleName: "",
        lastName: "",
        age: null,
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
                userId: patient.userId,
                firstName: patient.firstName || "",
                middleName: patient.middleName || "",
                lastName: patient.lastName || "",
                age: patient.age || null,
                gender: patient.gender || "",
                careOfRelation: patient.careOfRelation || "",
                careOfName: patient.careOfName || "",
                email: patient.email || "",
                contactNo: patient.contactNo || "",
                address: patient.address || "",
                city: patient.city || "",
                district: patient.district || "",
                state: patient.state || "",
                country: patient.country || "",
                postalCode: patient.postalCode || "",
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-auto">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mt-24">
                <h2 className="text-xl font-semibold text-center mb-4">{isUpdate ? "Update Patient" : "Add Patient"}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                    <InputField type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                    <InputField type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                    <InputField type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="flex overflow-hidden w-full gap-1 px-3 py-3.5 bg-white rounded-lg border border-solid border-zinc-300 text-black text-opacity-70"
                    >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select name="careOfRelation" value={formData.careOfRelation} onChange={handleChange}
                            className="flex overflow-hidden w-full gap-1 px-3 py-3.5 bg-white rounded-lg border border-solid border-zinc-300 text-black text-opacity-70">
                            <option value="" disabled>Select Care Of</option>
                            <option value="Father of">Father of</option>
                            <option value="Mother of">Mother of</option>
                            <option value="Son of">Son of</option>
                            <option value="Daughter of">Daughter of</option>
                            <option value="Husband of">Husband of</option>
                            <option value="Wife of">Wife of</option>
                            <option value="Brother of">Brother of</option>
                            <option value="Sister of">Sister of</option>
                            <option value="Guardian of">Guardian of</option>
                            <option value="Other">Other</option>
                        </select>
                        <InputField type="text" name="careOfName" placeholder="Name" value={formData.careOfName} onChange={handleChange} disabled={!formData.careOfRelation} />
                    </div>
                    <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} {...(isUpdate ? { disabled: true } : { required: true })} />
                    <InputField type="text" name="contactNo" placeholder="Contact No" value={formData.contactNo} onChange={handleChange} required />
                    <InputField type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                        <InputField type="text" name="district" placeholder="District" value={formData.district} onChange={handleChange} />
                        <InputField type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                        <InputField type="text" name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
                        <InputField type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} />
                    </div>
                    <div className="flex justify-end space-x-4">
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
