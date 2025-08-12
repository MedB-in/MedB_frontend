import { useEffect, useState } from "react";
import { getErrorLogsByUser } from "../../../services/controlPanel";
import Calendar from "../../Atoms/Calender";
import Pagination from "../../Atoms/Patient/Pagination";
import toast from "react-hot-toast";
import { getISTDate } from "../../../utils/time";
import { formatDate } from "../../../utils/format";

const ErrorLogs = ({ userId, timeFrom, timeTo }) => {
    const [logs, setLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getISTDate());
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async () => {
        if (!userId || !selectedDate?.date) return;
        setLoading(true);
        try {
            const date = selectedDate?.date || null;
            const response = await getErrorLogsByUser(page, date, userId, timeFrom, timeTo);
            setLogs(response.data.errorLogs || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch error logs. Try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId && selectedDate?.date) {
            fetchLogs();
        }
    }, [userId, selectedDate, page]);


    const handleDateSelect = (date) => {
        setPage(1);
        setSelectedDate(date);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Error Logs</h2>
            </div>
            <Calendar dateSelector={true} onDateSelect={handleDateSelect} />

            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : logs.length === 0 ? (
                <div className="text-gray-400 text-sm">No error logs found.</div>
            ) : (
                <div className="space-y-3">
                    {logs.map((log) => (
                        <div
                            key={log._id}
                            className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm"
                        >
                            <p className="text-sm text-red-600 font-semibold mb-2">{log.message}</p>
                            <div className="text-xs text-gray-700 space-y-1">
                                <p><strong>Status:</strong> {log.statusCode}</p>
                                <p><strong>URL:</strong> {log.url}</p>
                                <p><strong>Client IP:</strong> {log.clientIp}</p>
                                <p><strong>Timestamp:</strong> {formatDate(log.timestamp)}</p>
                                {log.stack && (
                                    <details className="mt-2 text-gray-600 whitespace-pre-wrap">
                                        <summary className="cursor-pointer font-medium text-sm">Stack Trace</summary>
                                        {log.stack}
                                    </details>
                                )}
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

export default ErrorLogs;
