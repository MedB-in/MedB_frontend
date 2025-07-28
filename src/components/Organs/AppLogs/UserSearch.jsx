import { useEffect, useState } from "react";
import { getUserList } from "../../../services/user";
import Input from "../../Atoms/Input";
import Pagination from "../../Atoms/Patient/Pagination";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const UserSearch = ({ onSelectUser }) => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUserList(query, currentPage);
            setUsers(response.data.data.userList || []);
            setTotalPages(response.data.data.totalPages);
            setCurrentPage(response.data.data.currentPage);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedUser && query.trim()) fetchUsers();
    }, [query, currentPage]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setQuery(`${user.firstName} ${user.lastName} (${user.email})`);
        onSelectUser(user);
    };

    const handleClear = () => {
        setSelectedUser(null);
        setQuery("");
        setUsers([]);
        onSelectUser(null);
    };

    return (
        <div className="mb-6 relative">
            <div className="relative">
                <Input
                    placeholder="Search users by name or email..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setCurrentPage(1);
                        setSelectedUser(null);
                    }}
                    className="pr-10"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {!selectedUser && query.trim() && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow max-h-64 overflow-auto">
                    {loading ? (
                        <div className="p-3 text-sm text-gray-500">Searching...</div>
                    ) : users.length === 0 ? (
                        <div className="p-3 text-sm text-gray-500">No users found.</div>
                    ) : (
                        <ul className="divide-y">
                            {users.map((user) => (
                                <li
                                    key={user.userId}
                                    onClick={() => handleUserClick(user)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                                >
                                    <div className="font-medium capitalize">
                                        {user.firstName} {user.lastName} <span className="text-gray-500 text-sm font-bold"> (User id: {user.userId})</span>
                                    </div>
                                    <div className="text-sm text-gray-600">{user.email} {user.contactNo ? `, Contact No: ${user.contactNo}` : ""}</div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {totalPages > 1 && (
                        <div className="p-2 border-t bg-gray-50">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserSearch;
