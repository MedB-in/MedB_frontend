import { useEffect, useState } from "react";
import Calendar from "../../../components/Atoms/Calender";
import Pagination from "../../../components/Atoms/Patient/Pagination";
import toast from "react-hot-toast";
import { getEmailLogsByUser } from "../../../services/controlPanel";
import { getISTDate } from "../../../utils/time";
import { formatDate } from "../../../utils/format";

const EmailLogs = ({ email, timeFrom, timeTo }) => {
    const [logs, setLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getISTDate());
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async () => {
        if (!email || !selectedDate?.date) return;
        setLoading(true);
        try {
            const response = await getEmailLogsByUser(page, selectedDate.date, email, timeFrom, timeTo);
            setLogs(response.data.emailLogs || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch email logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [email, selectedDate, page]);

    const handleDateSelect = (date) => {
        setPage(1);
        setSelectedDate(date);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Email Logs</h2>
            </div>
            <Calendar dateSelector={true} onDateSelect={handleDateSelect} />

            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : logs.length === 0 ? (
                <div className="text-gray-400 text-sm">No email logs found.</div>
            ) : (
                <div className="space-y-3">
                    {logs.map((log) => (
                        <div
                            key={log._id}
                            className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl shadow-sm"
                        >
                            <p className="text-sm text-yellow-800 font-semibold mb-1 truncate">
                                Subject: {log.subject}
                            </p>
                            <div className="text-xs text-gray-700 space-y-1">
                                <p><strong>To:</strong> {log.to}</p>
                                <p><strong>Status:</strong>
                                    <span className={`ml-1 font-medium ${log.status === "sent" ? "text-green-600" : "text-red-600"}`}>
                                        {log.status}
                                    </span>
                                </p>
                                {log.errorMessage && (
                                    <p><strong>Error:</strong> <span className="text-red-500">{log.errorMessage}</span></p>
                                )}
                                <p><strong>Timestamp:</strong> {formatDate(log.timestamp)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pt-4">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        setCurrentPage={setPage}
                    />
                </div>
            )}
        </div>
    );
};

export default EmailLogs;
