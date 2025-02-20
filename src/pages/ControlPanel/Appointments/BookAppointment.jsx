import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDoctors } from "../../../services/doctors";
import DefaultImage from "../../../assets/images/default-doctor.png";

const DoctorSelectionList = ({ onSelect }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await getDoctors();
                setDoctors(response.data.data || []);
            } catch (error) {
                toast.error("Failed to fetch doctors.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-500">Loading doctors...</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {doctors.length === 0 ? (
                <p className="text-center text-gray-500">No doctors available.</p>
            ) : (
                doctors.map((doctor) => (
                    <div
                        key={doctor.doctorId}
                        className="p-6 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition duration-200 cursor-pointer"
                        onClick={() => onSelect(doctor)}
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={doctor.profilePicture || DefaultImage}
                                alt={doctor.doctorName}
                                className="w-16 h-16 rounded-full object-cover border"
                            />
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">{doctor.speciality}</p>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default DoctorSelectionList;