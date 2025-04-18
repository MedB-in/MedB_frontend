import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRegistrationDetails } from "../../../services/publicApi";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const ClinicRegistrationStatus = () => {
    const { registrationId } = useParams();
    const [clinic, setClinic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await getRegistrationDetails(registrationId);
                setClinic(response.data.clinic);
            } catch (error) {
                toast.error(error.response?.data?.message || "Unable to fetch registration details.");
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [registrationId]);

    const getStatus = () => {
        if (clinic.isApproved) return "approved";
        if (clinic.isRejected) return "rejected";
        return "pending";
    };

    const status = getStatus();

    const statusColors = {
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        pending: "bg-yellow-100 text-yellow-800",
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
            </div>
        );
    }

    if (!clinic) {
        return (
            <div className="text-center py-20 self-center h-screen justify-center flex items-center pt-32 text-red-500 font-semibold text-lg">
                Registration details not found.
            </div>
        );
    }

    return (
        <div className="bg-white py-16 pt-24 px-6">

            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 pt-24">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Clinic Registration Status</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Info label="Clinic Name" value={clinic.name} />
                    <Info label="Email" value={clinic.email} />
                    <Info label="Contact" value={clinic.contact} />
                    <Info label="Website" value={clinic.website || "—"} />
                    <Info label="City" value={clinic.city} />
                    <Info label="District" value={clinic.district} />
                    <Info label="State" value={clinic.state} />
                    <Info label="Country" value={clinic.country} />
                    <Info label="Postal Code" value={clinic.postalCode} />
                    <Info label="Address" value={clinic.address} />
                </div>

                <div className="mt-8 text-center">
                    <span
                        className={`inline-block px-4 py-2 rounded-full font-medium text-sm ${statusColors[status] || "bg-gray-200 text-gray-800"
                            }`}
                    >
                        {status.toUpperCase()}
                    </span>

                    <p className="text-sm text-gray-600 mt-2">
                        {status === "approved" && "Your clinic registration has been approved. Welcome to MedB!"}
                        {status === "rejected" && "Unfortunately, your registration has been rejected. You may reapply or contact support."}
                        {status === "pending" && "Your clinic registration is currently under review. MedB team may reach out to you for verification."}
                    </p>
                </div>

            </div>
        </div>
    );
};

const Info = ({ label, value }) => (
    <div>
        <div className="text-gray-600 text-sm">{label}</div>
        <div className="font-medium text-gray-900">{value || "—"}</div>
    </div>
);

export default ClinicRegistrationStatus;
