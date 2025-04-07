import { useCallback, useEffect, useState } from "react";
import { getUserList } from "../../../services/user";
import toast from "react-hot-toast";
import AssignUserRightsModal from "../../../components/Organs/Users/UserIghtsModal";

function UserList() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async (query, page) => {
    setLoading(true);
    try {
      const response = await getUserList(query, page);
      setUsers(response.data.data.userList || []);
      setTotalPages(response.data.data.totalPages);
      setCurrentPage(response.data.data.currentPage);
    } catch (error) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      if (currentPage && (trimmedQuery.length > 0 || currentPage !== 1)) {
        fetchUsers(trimmedQuery, currentPage);
      } else if (trimmedQuery.length === 0 && currentPage === 1) {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage, fetchUsers]);


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
      <div className="mb-4 w-full max-w-md mt-5">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6">
        {loading ? (
          <div className="text-gray-600 text-lg mt-28 text-center">Loading...</div>
        ) : users.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="px-4 py-3 border border-gray-200">No.</th>
                <th className="px-4 py-3 border border-gray-200">Name</th>
                <th className="px-4 py-3 border border-gray-200">Email</th>
                <th className="px-4 py-3 border border-gray-200">Phone</th>
                <th className="px-4 py-3 border border-gray-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id || index}
                  className="odd:bg-white even:bg-gray-50 text-center hover:bg-gray-100 transition-all duration-200 ease-in-out"
                >
                  <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                  <td className="px-4 py-3 border border-gray-200">{user.firstName} {user.middleName ? ` ${user.middleName}` : ""}{user.lastName ? ` ${user.lastName}` : ""}</td>
                  <td className="px-4 py-3 border border-gray-200">{user.email}</td>
                  <td className="px-4 py-3 border border-gray-200">{user.phone}</td>
                  <td className="px-4 py-3 border border-gray-200 space-y-1">
                    <div className={user.isActive ? "text-green-600" : "text-red-600"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </div>
                    <div className={user.isVerified ? "text-green-600" : "text-red-600"}>
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal(true);
                      }}
                      className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md hover:bg-blue-200 transition"
                    >
                      Assign Rights
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-500 text-center py-10">No users found</div>
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
      <AssignUserRightsModal
        showModal={showModal}
        setShowModal={setShowModal}
        user={selectedUser}
      />
    </section>
  );
}

export default UserList;