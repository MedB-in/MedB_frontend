import { useEffect, useMemo, useState } from "react";
import { getClinicUsers } from "../../../services/clinics";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ClinicUserModal from "../../../components/Organs/Clinics/ClinicUserModal";
import BackButton from "../../../components/Atoms/BackButton";
import Pagination from "../../../components/Atoms/Patient/Pagination";

function ClinicUsers() {
    const { clinicId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await getClinicUsers(clinicId);
                if (response?.data?.data) {
                    const allUsers = response.data.data;
                    setUsers(allUsers);
                    setTotalPages(Math.ceil(allUsers.length / usersPerPage));
                } else {
                    setUsers([]);
                    toast.error("Invalid response from server");
                }
            } catch (error) {
                toast.error("Error fetching clinic users");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [clinicId]);

    const handleUserAdded = (newUser) => {
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setTotalPages(Math.ceil(updatedUsers.length / usersPerPage));
    };

    const generatePagination = useMemo(() => {
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
    }, [totalPages, currentPage]);

    const paginatedUsers = users.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    return (
        <div className="p-4">
            <BackButton />
            <section className="flex flex-col items-center justify-center text-center bg-white">
                <button
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add User
                </button>

                <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6">
                    <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="px-4 py-3 border border-gray-200">No.</th>
                                <th className="px-4 py-3 border border-gray-200">Name</th>
                                <th className="px-4 py-3 border border-gray-200">Email(Username)</th>
                                <th className="px-4 py-3 border border-gray-200">Contact</th>
                                <th className="px-4 py-3 border border-gray-200">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-3 border border-gray-200 text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {paginatedUsers.length > 0 ? (
                                        paginatedUsers.map((user, index) => (
                                            <tr key={index} className="odd:bg-white even:bg-gray-50">
                                                <td className="px-4 py-3 border border-gray-200">{(currentPage - 1) * usersPerPage + index + 1}</td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    {user.firstName} {user.middleName ? " " + user.middleName : ""} {user.lastName}
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">{user.email}</td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    {user.contactNo ? user.contactNo : "Not Provided"}
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    <div className="flex flex-col">
                                                        <span>{user.isVerified ? "✅ Verified" : "❌ Not Verified"}</span>
                                                        <span>{user.isActive ? "🟢 Active" : "🔴 Inactive"}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-3 border border-gray-200 text-center">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                        generatePagination={generatePagination}
                    />
                )}

                {isModalOpen && (
                    <ClinicUserModal clinicId={clinicId} onClose={() => setIsModalOpen(false)} onUserAdded={handleUserAdded} />
                )}
            </section>
        </div>
    );
}

export default ClinicUsers;