import { useEffect, useMemo, useState } from "react";
import { getEnquiries, updateEnquiryStatus } from "../../../services/controlPanel";
import toast from "react-hot-toast";
import Pagination from "../../../components/Atoms/Patient/Pagination";
import { formatDate } from "../../../utils/format";

const statusOptions = ["Pending", "In Progress", "Resolved", "Closed"];

const EnquiriesPage = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewing, setViewing] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const response = await getEnquiries(currentPage);
            setEnquiries(response.data.enquiries || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            updateEnquiryStatus(id, newStatus);
            setEnquiries((prev) =>
                prev.map((enq) =>
                    enq._id === id ? { ...enq, status: newStatus } : enq
                )
            );
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, [currentPage]);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };
    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
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

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Enquiries</h2>

            <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Message</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ? Array.from({ length: 5 }).map((_, idx) => (
                                <tr key={idx} className="animate-pulse border-t">
                                    <td className="p-3">
                                        <div className="h-4 bg-gray-200 rounded w-24" />
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 bg-gray-200 rounded w-24" />
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 bg-gray-200 rounded w-24" />
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 bg-gray-200 rounded w-40" />
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 bg-gray-200 rounded w-32" />
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 bg-gray-200 rounded w-40" />
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 bg-gray-200 rounded w-20" />
                                    </td>
                                    <td className="p-3">
                                        <div className="h-4 bg-gray-200 rounded w-16" />
                                    </td>
                                </tr>
                            ))
                            : enquiries.length > 0
                                ? enquiries.map((enq) => (
                                    <tr
                                        key={enq._id}
                                        className={`border-t ${enq.status === "Pending"
                                            ? "bg-yellow-50"
                                            : enq.status === "In Progress"
                                                ? "bg-green-200"
                                                : enq.status === "Resolved"
                                                    ? "bg-green-50"
                                                    : enq.status === "Closed"
                                                        ? "bg-gray-100"
                                                        : ""
                                            }`}
                                    >
                                        <td className="p-3">{formatDate(enq.createdAt)}</td>
                                        <td className="p-3 capitalize">{enq.name}</td>
                                        <td className="p-3">{enq.role}</td>
                                        <td className="p-3">{enq.email}</td>
                                        <td className="p-3">{enq.phone}</td>
                                        <td className="p-3 truncate max-w-sm">{enq.message.slice(0, 40)}...</td>
                                        <td className="p-3">
                                            <select
                                                value={enq.status}
                                                onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                                                className="border rounded px-2 py-1 text-sm"
                                            >
                                                {statusOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-3 space-x-2">
                                            <button
                                                className="text-blue-600 hover:underline"
                                                onClick={() => setViewing(enq)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                : (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-gray-500">
                                            No enquiries found.
                                        </td>
                                    </tr>
                                )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    generatePagination={generatePagination}
                    setCurrentPage={setCurrentPage}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                />
            )}

            {viewing && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="bg-white/20 border border-white/20 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg p-6 relative text-white">
                        <button
                            onClick={() => setViewing(null)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
                            aria-label="Close"
                        >
                            <span className="text-2xl">&times;</span>
                        </button>
                        <h2 className="text-2xl font-semibold mb-6 text-center">Enquiry Details</h2>
                        <div className="space-y-4 cursor-default">
                            <div className="capitalize">
                                <span className="font-medium text-white/80">Name:</span> {viewing.name}
                            </div>
                            <div>
                                <span className="font-medium text-white/80">Email:</span> {viewing.email}
                            </div>
                            <div>
                                <span className="font-medium text-white/80">Phone:</span> {viewing.phone || "N/A"}
                            </div>
                            <div>
                                <span className="font-medium block mb-1 text-white/80">Message:</span>
                                <p className="bg-white/10 rounded-lg p-3 border border-white/10 text-sm text-white/90 whitespace-pre-wrap">
                                    {viewing.message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnquiriesPage;
