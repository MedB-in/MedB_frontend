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
        navigate(`/appointments/book-slots/${clinicId}/${doctorId}`);
    };

    return (
        <section className="p-4 flex flex-col items-center min-h-[calc(100vh-80px)] bg-[#f0f0ff] rounded-3xl md:mr-4">
            <p className="text-sm self-start pl-5 underline font-bold text-[#7a5fd3] cursor-pointer" onClick={() => navigate(-1)}> {'<'} Back</p>
            <div className="flex flex-col w-full p-5">
                <div className="text-center text-white bg-[#7a5fd3] py-3 rounded-lg text-lg font-semibold">
                    Doctor List
                </div>
            </div>
            <div className="mb-4 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search Doctors..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-6">
                {loading ? (
                    Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="relative bg-gray-200 p-6 rounded-xl shadow-lg animate-pulse text-center border border-gray-300 h-[260px] w-[260px] mt-16 flex flex-col items-center justify-center"
                        >
                            <div className="absolute w-24 h-24 bg-gray-300 rounded-full -top-12 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md"></div>
                            <div className="mt-12 space-y-3 w-full flex flex-col items-center">
                                <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
                                <div className="bg-gray-300 h-5 w-2/3 rounded"></div>
                                <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
                                <div className="bg-gray-300 h-4 w-1/3 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : doctors.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">No doctors available.</p>
                ) : (
                    doctors.map((doctor) => (
                        <div
                            key={doctor.doctorId}
                            className="relative bg-[#c2b2f0] p-6 mt-16 h-[260px] w-[260px] rounded-xl shadow-lg transition-transform transform hover:scale-105 text-center cursor-pointer border border-gray-200"
                            onClick={() => onSelect(doctor.doctorId)}
                        >
                            <img
                                src={doctor.profilePicture || DefaultImage}
                                alt={doctor.doctorName}
                                className="absolute w-24 h-24 object-cover rounded-full -top-12 left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md"
                            />
                            <div className="mt-12">
                                <h3 className="bg-white px-4 py-2 rounded-lg inline-block font-bold text-purple-900 capitalize">Dr. {doctor.firstName} {doctor.middleName} {doctor.lastName}</h3>
                                <p className="text-black capitalize mt-5 text-lg font-medium">{doctor.speciality}</p>
                                <p className="text-black text-sm">{doctor.qualifications}</p>
                                <p className="text-black text-sm">Experience: {doctor.experience} years</p>
                            </div>
                            {/* <div className="absolute bottom-4 right-4 bg-purple-600 w-10 h-10 flex justify-center items-center rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition">
                                <img src="image/arrow-up-right-01.png" alt="Arrow" className="w-5 invert" />
                            </div> */}
                        </div>
                    ))
                )}
            </div>
            {totalPages !== 1 && (
                <div className="mt-8 flex justify-center items-center space-x-3">
                    <button
                        className="px-5 py-3 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {generatePagination().map((page, index) => (
                        <button
                            key={index}
                            className={`${page === "..." ? "text-gray-400 cursor-default" : page === currentPage ? "bg-purple-500 text-white font-bold" : "bg-gray-100 hover:bg-gray-200 text-gray-700"} px-5 py-3 rounded-lg`}
                            onClick={() => page !== "..." && setCurrentPage(page)}
                            disabled={page === "..."}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        className="px-5 py-3 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
};

export default DoctorSelectionList;
