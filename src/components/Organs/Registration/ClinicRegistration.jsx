import { useEffect, useState } from "react";
import FormInput from "../../Atoms/Login/InputField";
import FormButton from "../../Atoms/Login/Button";
import { getRegistrationDetails, registerClinic, updateRegistration } from "../../../services/publicApi";
import registration from "../../../assets/images/registration.png";
import toast from "react-hot-toast";
import LocationSelector from "../../LocationSelector";
import TermsModal from "../Clinics/TermsModal";
import { useNavigate, useParams } from "react-router-dom";

const ClinicRegistration = () => {
    const navigate = useNavigate();
    const { registrationId } = useParams()
    const [loading, setLoading] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [locationKey, setLocationKey] = useState(0);
    const [clinic, setClinic] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        address: "",
        clinicOverview: "",
        city: "",
        district: "",
        state: "",
        country: "",
        postalCode: "",
        contact: "",
        email: "",
        website: "",
        registrationNumber: "",
        clinicPicture: "",
        acceptTerms: false,
    });

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await getRegistrationDetails(registrationId);
                const clinicData = response.data.clinic;
                setClinic(clinicData);

                if (!clinicData.isApproved) {
                    setFormData({
                        name: clinicData.name || "",
                        clinicOverview: clinicData.clinicOverview || "",
                        location: clinicData.location || "",
                        address: clinicData.address || "",
                        city: clinicData.city || "",
                        district: clinicData.district || "",
                        state: clinicData.state || "",
                        country: clinicData.country || "",
                        postalCode: clinicData.postalCode || "",
                        contact: clinicData.contact || "",
                        email: clinicData.email || "",
                        website: clinicData.website || "",
                        registrationNumber: clinicData.registrationNumber || "",
                        clinicPicture: clinicData.clinicPicture || "",
                        acceptTerms: false,
                    });
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Unable to fetch registration details.");
            } finally {
                setLoading(false);
            }
        };

        if (registrationId) {
            setLoading(true);
            fetchStatus();
        }
    }, [registrationId]);


    const getStatus = () => {
        if (clinic?.isApproved) return "approved";
        if (clinic?.isRejected) return "rejected";
        return "pending";
    };

    const status = getStatus();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleAcceptTerms = () => {
        setFormData((prev) => ({ ...prev, acceptTerms: true }));
        setShowTermsModal(false);
    };

    const handleSubmitForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.acceptTerms) {
            toast.error("Please accept the terms and conditions.");
            setLoading(false);
            return;
        }

        try {
            let response;
            if (registrationId && status !== "approved") {
                response = await updateRegistration(registrationId, formData);
            } else {
                response = await registerClinic(formData);
            }
            toast.success(response.data.message);
            handleClear();
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            name: "",
            clinicOverview: "",
            location: "",
            address: "",
            city: "",
            district: "",
            state: "",
            country: "",
            postalCode: "",
            contact: "",
            email: "",
            website: "",
            registrationNumber: "",
            clinicPicture: "",
            acceptTerms: false,
        });
        setLocationKey(prev => prev + 1);
    };

    const handleLocationSelect = (lat, lng, address, city, district, state, country, postalCode) => {
        setFormData((prev) => ({
            ...prev,
            location: {
                type: "Point",
                coordinates: [lng, lat],
            },
            address,
            city,
            district,
            state,
            country,
            postalCode,
        }));
    };

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
                    {registrationId && status === "approved" ? (
                        <div className="flex items-center justify-center text-green-600 font-semibold text-xl px-10">
                            ✅ Your clinic registration has been approved.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitForm} className="space-y-8">
                            <h1 className="text-3xl font-bold text-gray-900">{registrationId ? "Update Your Clinic Registration" : "Register Your Clinic Now"}</h1>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                <FormInput
                                    type="text"
                                    placeholder="Clinic Name*"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <FormInput
                                    type="textarea"
                                    rows="4"
                                    placeholder="Overview"
                                    name="clinicOverview"
                                    value={formData.clinicOverview}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col w-full md:w-1/2 md:pr-4">
                                <span className="text-sm text-gray-500 mb-2">For better accuracy, please select the exact location of your clinic.</span>
                                <LocationSelector
                                    key={locationKey}
                                    onSelect={handleLocationSelect}
                                />
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
                                    type="tel"
                                    placeholder="Contact Number*"
                                    name="contact"
                                    value={formData.contact}
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
                                    placeholder="Registration Number*"
                                    name="registrationNumber"
                                    value={formData.registrationNumber}
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
                            </div>
                        </form>
                    )}
                </div>
            </div>
            {showTermsModal && (
                <TermsModal
                    onClose={() => setShowTermsModal(false)}
                    onAccept={handleAcceptTerms}
                />
            )}
        </div>
    );
};

export default ClinicRegistration;