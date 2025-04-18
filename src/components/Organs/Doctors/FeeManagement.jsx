import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getDoctorFee, postDoctorFee } from "../../../services/doctors";
import FormInput from "../../Atoms/Login/InputField";
import FormButton from "../../Atoms/Login/Button";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const FeeMangement = () => {
    const { doctorId, clinicId } = useParams();
    const [currentFee, setCurrentFee] = useState(null);
    const [newFee, setNewFee] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFee = async () => {
            try {
                const response = await getDoctorFee(doctorId, clinicId);
                if (response?.data?.fees) {
                    setCurrentFee(response.data.fees);
                    setNewFee(response.data.fees.toString());
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        };

        if (doctorId && clinicId) fetchFee();
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
                Set the consultation fee for the selected doctor. This fee will be applied across all consultation appointments booked under this clinic.
            </p>

            <div className="mb-6">
                <p className="text-gray-700 text-base">
                    <span className="font-medium">Current Fee: </span>
                    {currentFee && '₹'} {currentFee ? currentFee : "N/A"}
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
                    <FormButton type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Fee"}
                    </FormButton>
                </div>
            </form>
        </div>
    );
};

export default FeeMangement;
