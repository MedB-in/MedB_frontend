import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getActiveDoctors } from "../../../services/doctors";
import DefaultImage from "../../../assets/images/default-doctor.png";
import { useNavigate, useParams } from "react-router-dom";

const DoctorSelectionList = () => {
    const { clinicId } = useParams();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await getActiveDoctors(clinicId, currentPage, searchQuery);
                setDoctors(response.data.doctors || []);
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                toast.error("Failed to fetch doctors.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [currentPage, searchQuery]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const generatePagination = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 4) {
            return [1, 2, 3, 4, "...", totalPages];
        } else if (currentPage >= totalPages - 3) {
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
        }
    };

    const onSelect = (doctorId) => {
        navigate(`/book-slots/${clinicId}/${doctorId}`);
    };

    return (
        <div className="p-4">
            <div className="mb-4 w-full max-w-md mx-auto">
                <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && <p className="text-center">Loading clinics...</p>}
                {doctors.length === 0 ? (
                    <p className="text-center text-gray-500">No doctors available.</p>
                ) : (
                    doctors.map((doctor) => (
                        <div
                            key={doctor.doctorId}
                            className="p-6 border border-gray-200 rounded-xl shadow-md bg-white hover:shadow-lg transition duration-200 cursor-pointer"
                            onClick={() => onSelect(doctor.doctorId)}
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
                                    <p className="text-sm text-gray-500">{doctor.qualifications}</p>
                                    <p className="text-sm text-gray-500">Experience: {doctor.experience} years.</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="mt-6 flex justify-center items-center space-x-2">
                <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Prev
                </button>
                {generatePagination().map((page, index) => (
                    <button
                        key={index}
                        className={`${page === "..." ? "text-gray-400 cursor-default" : page === currentPage ? "bg-gray-300 text-gray-800 font-bold" : "bg-gray-100 hover:bg-gray-200 text-gray-700"} px-4 py-2 rounded-lg`}
                        onClick={() => page !== "..." && setCurrentPage(page)}
                        disabled={page === "..."}
                    >
                        {page}
                    </button>
                ))}
                <button
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 disabled:opacity-50"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DoctorSelectionList;
