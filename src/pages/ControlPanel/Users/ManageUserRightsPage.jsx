import { useCallback, useEffect, useState } from "react";
import { getUserList } from "../../../services/user";
import { getClinicUsers } from "../../../services/clinics";
import { useParams } from 'react-router-dom';
import toast from "react-hot-toast";
import UserRightsModal from "../../../components/Organs/Users/UserRightsModal";
import { ArrowLeft } from "lucide-react";
import BackButton from "../../../components/Atoms/BackButton";

function UserList() {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { clinicId } = useParams('clinicId');

    const fetchUsers = useCallback(async (query, page) => {
        setLoading(true);
        try {
            const response = await getUserList(query, page);
            setUsers(response.data.data.userList || []);
            setTotalPages(response.data.data.totalPages);
            setCurrentPage(response.data.data.currentPage);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const fetchClinicUsers = async () => {
            if (!clinicId) return;
            try {
                setLoading(true);
                const response = await getClinicUsers(clinicId);
                setUsers(response.data.data || []);
            } catch (error) {
                toast.error(error?.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchClinicUsers();
    }, [clinicId]);

    useEffect(() => {
        if (clinicId) return;

        const delayDebounce = setTimeout(() => {
            const trimmedQuery = searchQuery.trim();
            if (currentPage && (trimmedQuery.length > 0 || currentPage !== 1)) {
                fetchUsers(trimmedQuery, currentPage);
            } else if (trimmedQuery.length === 0 && currentPage === 1) {
                setUsers([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, currentPage, fetchUsers, clinicId]);


    const handleSearch = (e) => {
        const newQuery = e.target.value;
        setSearchQuery(newQuery);
        if (currentPage !== 1) setCurrentPage(1);
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

    return (
        <section className="flex flex-col items-center justify-center text-center bg-white">
            <div className="p-4 self-start">
                <BackButton />
            </div>
            {!clinicId &&

                <div className="mb-4 w-full max-w-md mt-5">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                </div>
            }
            <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6">
                {loading ? (
                    <div className="mt-28">
                        <table className="min-w-full text-sm text-gray-800 animate-pulse">
                            <thead className="bg-white/70 backdrop-blur text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3 text-center">No.</th>
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Phone</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...Array(5)].map((_, i) => (
                                    <tr
                                        key={i}
                                        className="odd:bg-white/50 even:bg-white/30"
                                    >
                                        <td className="px-4 py-3 text-center">
                                            <div className="h-4 bg-gray-300 rounded w-6 mx-auto" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-300" />
                                                <div className="flex flex-col gap-1">
                                                    <div className="h-4 bg-gray-300 rounded w-32" />
                                                    <div className="h-3 bg-gray-200 rounded w-20" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="h-4 bg-gray-300 rounded w-40" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="h-4 bg-gray-300 rounded w-24" />
                                        </td>
                                        <td className="px-4 py-3 space-y-2">
                                            <div className="h-4 bg-gray-300 rounded w-20 mx-auto" />
                                            <div className="h-4 bg-gray-300 rounded w-24 mx-auto" />
                                            <div className="h-6 bg-gray-200 rounded w-24 mx-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : users.length > 0 ? (
                    <table className="min-w-full text-sm text-gray-800">
                        <thead className="bg-white/70 backdrop-blur text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-4 py-3 text-center">No.</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Phone</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr
                                    key={user._id || index}
                                    className="odd:bg-white/50 cursor-pointer even:bg-white/30 hover:bg-gray-100 transition-all duration-200"
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setShowModal(true);
                                    }}
                                >
                                    <td className="px-4 py-3 text-center font-medium">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {user.profilePicture ? (
                                                <img
                                                    src={user.profilePicture}
                                                    alt="user"
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-semibold uppercase">
                                                    {user.firstName?.[0] || "U"}
                                                </div>
                                            )}
                                            <div className="flex flex-col self-start">
                                                <span className="font-semibold self-start capitalize">
                                                    {user.firstName}
                                                    {user.middleName ? ` ${user.middleName}` : ""}
                                                    {user.lastName ? ` ${user.lastName}` : ""}
                                                </span>
                                                {user.address && (
                                                    <span className="text-sm self-start text-gray-500">{user.address}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-left">{user.email}</td>
                                    <td className="px-4 py-3 text-left">{user.contactNo ? user.contactNo : "-"}</td>
                                    <td className="px-4 py-3 space-y-1">
                                        <div className={user.isActive ? "text-green-700" : "text-red-600"}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </div>
                                        <div className={user.isVerified ? "text-green-700" : "text-red-600"}>
                                            {user.isVerified ? "Verified" : "Not Verified"}
                                        </div>
                                        <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md hover:bg-blue-200 transition">
                                            Assign Rights
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                ) : searchQuery ? (
                    <div className="text-gray-500 text-center py-10">No users found</div>
                ) : (
                    <div className="text-gray-500 text-center py-10">{clinicId ? "" : "Search for users"}</div>
                )}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
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
                            className={`${page === "..." ? "text-gray-400 cursor-default"
                                : page === currentPage
                                    ? "bg-gray-300 text-gray-800 font-bold"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"} px-4 py-2 rounded-lg`}
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
            )}
            <UserRightsModal
                clinicId={clinicId}
                showModal={showModal}
                setShowModal={setShowModal}
                user={selectedUser}
            />
        </section>
    );
}

export default UserList;