import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getDoctorFee, postDoctorFee, getActiveDoctorsList } from "../../../services/doctors";
import FormInput from "../../../components/Atoms/Login/InputField";
import FormButton from "../../../components/Atoms/Login/Button";
import toast from "react-hot-toast";

const FeeMangement = () => {
    const [clinicId, setClinicId] = useState(null);
    const [doctorId, setDoctorId] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [currentFee, setCurrentFee] = useState(null);
    const [newFee, setNewFee] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const userDetails = JSON.parse(localStorage.getItem("userDetails"));

                if (!userDetails?.clinicId) {
                    toast.error("Clinic ID not found");
                    return;
                }

                const clinicId = userDetails.clinicId;
                setClinicId(clinicId);

                const response = await getActiveDoctorsList(clinicId);
                setDoctors(response?.data.doctors || []);
            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        };

        fetchDoctorDetails();
    }, []);

    useEffect(() => {
        const fetchFee = async () => {
            if (!clinicId || !doctorId) return;

            try {
                const feeRes = await getDoctorFee(doctorId, clinicId);
                if (feeRes?.data?.fees) {
                    setCurrentFee(feeRes.data.fees);
                    setNewFee(feeRes.data.fees.toString());
                } else {
                    setCurrentFee(null);
                    setNewFee("");
                }
            } catch (error) {
                toast.error("Failed to fetch doctor fee");
            }
        };

        fetchFee();
    }, [doctorId, clinicId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newFee || isNaN(newFee)) {
            Swal.fire("Invalid", "Please enter a valid fee amount", "warning");
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: `This will update the consultation fee to ₹${newFee}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Update it!",
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                await postDoctorFee(doctorId, clinicId, { consultationFee: Number(newFee) });
                Swal.fire("Success", "Consultation fee updated successfully", "success");
                setCurrentFee(Number(newFee));
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Something went wrong. Try again later.", "error");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow-xl rounded-2xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-blue-700 mb-1">Consultation Fee Management</h2>
            <p className="text-gray-600 mb-4 text-sm">
                Set the consultation fee for a selected doctor. This fee will be applied to all appointments under this clinic.
            </p>

            <div className="mb-4">
                <label className="block text-gray-700 mb-1 font-medium">Select Doctor</label>
                <select
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                >
                    <option value="" disabled>
                        Select Doctor from List
                    </option>
                    {doctors?.map((doctor) => (
                        <option key={doctor.doctorId} value={doctor.doctorId}>
                            {`${doctor.firstName} ${doctor.middleName ? doctor.middleName + " " : ""}${doctor.lastName || ""}`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                <p className="text-gray-700 text-base">
                    <span className="font-medium">Current Fee: </span>
                    {currentFee !== null ? `₹ ${currentFee}` : "N/A"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                    label="New Consultation Fee (in ₹)"
                    type="number"
                    value={newFee}
                    onChange={(e) => setNewFee(e.target.value)}
                    required
                />
                <div className="flex justify-center">
                    <FormButton type="submit" disabled={loading || !doctorId}>
                        {loading ? "Updating..." : "Update Fee"}
                    </FormButton>
                </div>
            </form>
        </div>
    );
};

export default FeeMangement;
