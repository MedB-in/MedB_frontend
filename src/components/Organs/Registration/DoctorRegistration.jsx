import React, { useState } from "react";
import FormInput from "../../Atoms/Login/InputField";
import FormButton from "../../Atoms/Login/Button";
import { registerDoctor } from "../../../services/publicApi";
import { motion } from "framer-motion";
import registration from "../../../assets/images/registration.png";
import toast from "react-hot-toast";
import LocationSelector from "../../LocationSelector";
import TermsModal from "../Clinics/TermsModal";

const DoctorRegistration = () => {
    // const [loading, setLoading] = useState(false);
    // const [showTermsModal, setShowTermsModal] = useState(false);
    // const [formData, setFormData] = useState({
    //     firstName: "",
    //     middleName: "",
    //     lastName: "",
    //     age: '',
    //     registration: "",
    //     doctorOverview: "",
    //     clinicOverview: "",
    //     speciality: "",
    //     email: "",
    //     phone: "",
    //     profilePicture: "",
    //     gender: "",
    //     qualifications: "",
    //     experience: "",
    //     location: { type: "Point", coordinates: [0, 0] },
    //     address: "",
    //     city: "",
    //     district: "",
    //     state: "",
    //     country: "",
    //     postalCode: "",
    //     isActive: false,
    //     isVerified: false,
    //     isOwnClinic: false,
    //     website: "",
    //     acceptTerms: false,
    // });

    // const handleChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setFormData((prev) => ({
    //         ...prev,
    //         [name]: type === "checkbox" ? checked : value,
    //     }));
    // };

    // const handleAcceptTerms = () => {
    //     setFormData((prev) => ({ ...prev, acceptTerms: true }));
    //     setShowTermsModal(false);
    // };


    // const handleSubmitForm = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     if (!formData.acceptTerms) {
    //         toast.error("Please accept the terms and conditions.");
    //         return;
    //     }
    //     try {
    //         const response = await registerClinic(formData);
    //         toast.success(response.data.message);
    //         handleClear();
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "Something went wrong");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleClear = () => {
    //     setFormData({
    //     firstName: "",
    //     middleName: "",
    //     lastName: "",
    //     age: '',
    //     registration: "",
    //     doctorOverview: "",
    //     clinicOverview: "",
    //     speciality: "",
    //     email: "",
    //     phone: "",
    //     profilePicture: "",
    //     gender: "",
    //     qualifications: "",
    //     experience: "",
    //     location: { type: "Point", coordinates: [0, 0] },
    //     address: "",
    //     city: "",
    //     district: "",
    //     state: "",
    //     country: "",
    //     postalCode: "",
    //     isActive: false,
    //     isVerified: false,
    //     isOwnClinic: false,
    //     website: "",
    //     acceptTerms: false,
    //     });
    // };

    // const handleLocationSelect = (lat, lng, address, city, district, state, country, postalCode) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         location: {
    //             type: "Point",
    //             coordinates: [lng, lat],
    //         },
    //         address,
    //         city,
    //         district,
    //         state,
    //         country,
    //         postalCode,
    //     }));
    // };

    return (
        <div className="bg-white py-16 pt-24 px-6">
            <div className="flex flex-col lg:flex-row mx-auto gap-8">
                <div className="w-full lg:w-1/3 p-10">
                    <img
                        src={registration}
                        alt="Clinic"
                        className="w-full h-auto rounded-xl object-cover"
                    />
                </div>
                <div className="w-full lg:w-2/3 p-10">
                    {/* <form onSubmit={handleSubmitForm} className="space-y-8"> */}
                    <h1 className="text-3xl font-bold text-gray-900">Doctor Registration</h1>
                    <h3 className="text-lg font-semibold mb-4">Please contact us for more information.</h3>
                    <p
                        className={`text-blue-600 font-medium py-2 cursor-pointer`}
                        onClick={() => window.dispatchEvent(new Event("scroll-to-contact"))}
                    >
                        Contact Us
                    </p>
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormInput
                                type="text"
                                placeholder="First Name*"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="text"
                                placeholder="Middle Name"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                            <FormInput
                                type="text"
                                placeholder="Last Name*"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="textarea"
                                rows="4"
                                placeholder="Overview"
                                name="doctorOverview"
                                value={formData.doctorOverview}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 md:pr-4">
                            <LocationSelector onSelect={handleLocationSelect} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                type="text"
                                placeholder="Address*"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="text"
                                placeholder="City*"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="text"
                                placeholder="District*"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="text"
                                placeholder="State*"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="text"
                                placeholder="Country*"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="text"
                                placeholder="Postal Code*"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="text"
                                placeholder="Speciality*"
                                name="speciality"
                                value={formData.speciality}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="text"
                                placeholder="Qualification*"
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="number"
                                placeholder="Experience*"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="select"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: "", label: "Select Gender" },
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                    { value: "other", label: "Other" },
                                    ]}
                            />
                            <FormInput
                                type="tel"
                                placeholder="Contact Number*"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                pattern="[6-9]{1}[0-9]{9}"
                                maxLength={10}
                                title="Enter a valid 10-digit mobile number"
                            />
                            <FormInput
                                type="email"
                                placeholder="Email*"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="text"
                                placeholder="Registration*"
                                name="registration"
                                value={formData.registration}
                                onChange={handleChange}
                                required
                            />
                            <FormInput
                                type="url"
                                placeholder="Website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="w-4 h-4 border border-gray-300 rounded"
                            />
                            <span className="text-gray-700">
                                I have read, understood and accept the{" "}
                                <span className="text-blue-600 underline cursor-pointer" onClick={() => setShowTermsModal(true)}>
                                    terms and conditions
                                </span>.
                            </span>
                        </div>
                        <div className="flex gap-4 justify-end">
                            <FormButton type="button" variant="secondary" onClick={handleClear}>
                                Clear
                            </FormButton>
                            <FormButton type="submit" disabled={!formData.acceptTerms || loading}>{loading ? "Submitting..." : "Submit"}</FormButton>
                        </div> */}
                    {/* </form> */}
                </div>
            </div>
            {/* {showTermsModal && (
                <TermsModal
                    onClose={() => setShowTermsModal(false)}
                    onAccept={handleAcceptTerms}
                />
            )} */}
        </div>
    );
};

export default DoctorRegistration;