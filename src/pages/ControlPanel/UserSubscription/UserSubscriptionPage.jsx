import { useEffect, useState } from "react";
import { getSubscriptions } from "../../../services/subscriptions";
import toast from "react-hot-toast";
import Button from "../../../components/Atoms/Login/Button";
import AddSubscriptionModal from "../../../components/Organs/UserSubscription/AddSubscriptionModal";

function UserSubscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getSubscriptions(currentPage, searchQuery);
      setSubscriptions(response.data.subscriptions);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      toast.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

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

  const handleSearch = (e) => {
    setLoading(true);
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddSubscription = () => {
    fetchData();
  };

  return (
    <section className="flex flex-col items-center justify-center text-center bg-white">
      <div className="w-full flex justify-center my-6">
        <div className="w-full max-w-md flex flex-col items-center gap-4">
          <Button variant="primary" onClick={() => setShowModal(true)} disabled={loading}>
            Add Subscription to User
          </Button>
          <input
            type="text"
            placeholder="Search by name, email, phone or product..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-800 placeholder-gray-500"
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Add New Subscription</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-600">✕</button>
            </div>
            <AddSubscriptionModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onAddSubscription={handleAddSubscription}
            />
          </div>
        </div>
      )}

      <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6">
        {loading ? (
          <div className="text-gray-600 text-lg mt-28 text-center">Loading...</div>
        ) : (
          <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="px-4 py-3 border border-gray-200">User Id</th>
                <th className="px-4 py-3 border border-gray-200">User</th>
                <th className="px-4 py-3 border border-gray-200">Product</th>
                <th className="px-4 py-3 border border-gray-200">Period</th>
                <th className="px-4 py-3 border border-gray-200">Payment</th>
                <th className="px-4 py-3 border border-gray-200">Amount</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length > 0 ? (
                subscriptions.map((sub, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-3 border border-gray-200">{sub.userId}</td>
                    <td className="px-4 py-3 border border-gray-200">
                      <div className="flex flex-col gap-1">
                        <div className="font-medium text-gray-800">{sub.userName}</div>
                        <div className="text-sm text-gray-600">{sub.email}</div>
                        <div className="text-sm text-gray-400">{sub.contactNo ? sub.contactNo : "Contact number not found"}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border border-gray-200">{sub.productName}</td>
                    <td className="px-4 py-3 border border-gray-200">
                      <div className="flex flex-col gap-1">
                        <div>
                          <span className="font-semibold text-gray-700">Start:</span>{' '}
                          <span className="text-gray-800">{new Date(sub.startDate).toLocaleDateString("en-GB")}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Expires:</span>{' '}
                          <span className="text-gray-800">{new Date(sub.expiryDate).toLocaleDateString("en-GB")}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 border border-gray-200 font-semibold ${sub.isPaid ? "text-green-600" : "text-red-500"}`}>
                      {sub.isPaid ? "Paid" : "Unpaid"}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">Rs. {sub.netAmount ?? 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-3 border border-gray-200 text-center">
                    No subscriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

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
      </div>
    </section>
  );
}

export default UserSubscription;