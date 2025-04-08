import { useCallback, useEffect, useState } from "react";
import { getUserRightsList } from "../../../services/user";
import toast from "react-hot-toast";
import Button from "../../../components/Atoms/Login/Button";
import { useNavigate } from "react-router-dom";
import EditUserRightsModal from "../../../components/Organs/Users/EditUserRightsModal";

function UserRightsList() {
  const [usersWithRights, setUsersWithRights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRights, setSelectedRights] = useState(null);

  const navigate = useNavigate();

  const handleSetNewRights = (updatedPermissions) => {
    setUsersWithRights((prevList) =>
      prevList.map((item) =>
        item.userRightId === selectedRights.userRightId
          ? { ...item, ...updatedPermissions }
          : item
      )
    );
  };

  const fetchUsersWithRights = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await getUserRightsList(page);
      setUsersWithRights(response.data.userRightsList || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.currentPage || 1);
    } catch (error) {
      toast.error("Error fetching user rights list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsersWithRights(currentPage);
  }, [currentPage, fetchUsersWithRights]);

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
      <div className="w-full flex items-center justify-center">
        <Button
          onClick={() => navigate("/users/manage-user-rights")}
        >
          Manage User Rights
        </Button>
      </div>
      <div className="w-full mx-auto p-6 mt-5">
        {loading ? (
          <div className="overflow-x-auto rounded-2xl shadow-lg backdrop-blur-md bg-white/60 ring-1 ring-gray-200">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-white/70 backdrop-blur text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-center">No.</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Clinic</th>
                  <th className="px-4 py-3 text-left">Module / Menu</th>
                  <th className="px-4 py-3 text-left">Rights</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white/50 even:bg-white/30 animate-pulse"
                  >
                    <td className="px-4 py-3 text-center">
                      <div className="w-5 h-5 bg-gray-300 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                        <div className="w-24 h-4 bg-gray-300 rounded"></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-32 h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-4 bg-gray-300 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-lg bg-gray-300"></div>
                        <div className="flex flex-col gap-1">
                          <div className="w-28 h-4 bg-gray-300 rounded"></div>
                          <div className="w-32 h-3 bg-gray-200 rounded"></div>
                          <div className="w-24 h-3 bg-gray-200 rounded"></div>
                          <div className="w-20 h-3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <div className="w-28 h-4 bg-gray-300 rounded"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded ml-6"></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {["View", "Create", "Edit", "Delete"].map((right, i) => (
                          <div
                            key={i}
                            className="w-14 h-5 bg-gray-300 rounded-full"
                          ></div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : usersWithRights.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl shadow-lg backdrop-blur-md bg-white/60 ring-1 ring-gray-200">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-white/70 backdrop-blur text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-center">No.</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Clinic</th>
                  <th className="px-4 py-3 text-left">Module / Menu</th>
                  <th className="px-4 py-3 text-left">Rights</th>
                </tr>
              </thead>
              <tbody>
                {usersWithRights.map((user, index) => (
                  <tr
                    key={user.userRightId}
                    className="odd:bg-white/50  cursor-pointer even:bg-white/30 hover:bg-gray-100 transition-all duration-200"
                    onClick={() => {
                      setSelectedRights(user);
                      setShowModal(true);
                    }}
                  >
                    <td className="px-4 py-3 text-center font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.userProfileImage ? (
                          <img
                            src={user.userProfileImage}
                            alt="user"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs">
                            {user.userName?.[0] || "U"}
                          </div>
                        )}
                        <span className="font-semibold">{user.userName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left">{user.userEmail}</td>
                    <td className="px-4 py-3 text-left">{user.userContactNumber || "N/A"}</td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-4">
                        {user.clinicImage && (
                          <img
                            src={user.clinicImage}
                            alt="clinic"
                            className="w-14 h-14 rounded-lg object-cover border border-gray-300 shadow-sm"
                          />
                        )}
                        <div className="flex flex-col text-sm items-start">
                          <span className="font-medium text-gray-800">{user.clinicName}</span>
                          <span className="text-gray-600">{user.clinicAddress}</span>
                          <span className="text-gray-500">{user.clinicEmail}</span>
                          <span className="text-gray-500">{user.clinicContactNumber}</span>
                        </div>
                      </div>
                    </td>
                    {/* Menu / Module */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {user.moduleIcon && (
                            <img src={user.moduleIcon} alt="module" className="w-5 h-5" />
                          )}
                          <span className="font-medium text-gray-800">{user.moduleName}</span>
                        </div>
                        <div className="flex items-center gap-2 pl-7 text-sm text-gray-500">
                          <span className="text-xs">➝</span>
                          {user.menuIcon && (
                            <img src={user.menuIcon} alt="menu" className="w-4 h-4" />
                          )}
                          <span>{user.menuName}</span>
                        </div>
                      </div>
                    </td>
                    {/* Rights */}
                    <td className="px-4 py-3 items-start">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${user.viewAllowed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          View
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${user.createAllowed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          Create
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${user.editAllowed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          Edit
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${user.deleteAllowed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                            }`}
                        >
                          Delete
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-10">No users with rights found</div>
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
      <EditUserRightsModal
        showModal={showModal}
        setShowModal={setShowModal}
        rights={selectedRights}
        setNewRights={handleSetNewRights}
      />
    </section>
  );
}

export default UserRightsList;
