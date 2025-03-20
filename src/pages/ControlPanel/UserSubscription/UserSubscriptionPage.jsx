import { useEffect, useState } from "react";
import { getSubscriptions } from "../../../services/subscriptions";

function UserSubscription() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getSubscriptions(currentPage, searchQuery);
        setSubscriptions(response.data.subscriptions);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    }
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

  return (
    <section className="flex flex-col items-center justify-center  text-center bg-white">
      {/* Search Input */}
      <div className="mb-4 w-full max-w-md mt-5">
        <input
          type="text"
          placeholder="Search by name or product..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6">
        {loading ? (
          <div className="text-gray-600 text-lg mt-28 text-center">Loading...</div>
        ) : (
          <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="px-4 py-3 border border-gray-200">No.</th>
                <th className="px-4 py-3 border border-gray-200">Name</th>
                <th className="px-4 py-3 border border-gray-200">Product</th>
                <th className="px-4 py-3 border border-gray-200">Start Date</th>
                <th className="px-4 py-3 border border-gray-200">Expiry Date</th>
                <th className="px-4 py-3 border border-gray-200">Payment</th>
                <th className="px-4 py-3 border border-gray-200">Amount</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.length > 0 ? (
                subscriptions.map((sub, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                    <td className="px-4 py-3 border border-gray-200">{sub.userName}</td>
                    <td className="px-4 py-3 border border-gray-200">{sub.productName}</td>
                    <td className="px-4 py-3 border border-gray-200">{new Date(sub.startDate).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3 border border-gray-200">{new Date(sub.expiryDate).toLocaleDateString("en-GB")}</td>
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

        {/* Pagination */}
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