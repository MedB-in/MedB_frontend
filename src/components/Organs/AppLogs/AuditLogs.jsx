import { useEffect, useState } from "react";
import Calendar from "../../Atoms/Calender";
import Pagination from "../../Atoms/Patient/Pagination";
import toast from "react-hot-toast";
import { getAuditLogsByUser } from "../../../services/controlPanel";
import { getISTDate } from "../../../utils/time";

const JsonBlock = ({ title, data }) => (
    <details className="bg-gray-100 p-3 rounded-lg">
        <summary className="cursor-pointer font-semibold text-sm mb-1">{title}</summary>
        <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap break-all mt-2">
            {JSON.stringify(data, null, 2)}
        </pre>
    </details>
);

const AuditLogs = ({ userId, timeFrom, timeTo }) => {
    const [logs, setLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getISTDate());
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchLogs = async () => {
        if (!userId || !selectedDate?.date) return;
        setLoading(true);
        try {
            const response = await getAuditLogsByUser(page, selectedDate.date, userId, timeFrom, timeTo);
            setLogs(response.data.auditLogs || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch audit logs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [userId, selectedDate, page]);

    const handleDateSelect = (date) => {
        setPage(1);
        setSelectedDate(date);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Audit Logs</h2>
            </div>
            <Calendar dateSelector={true} onDateSelect={handleDateSelect} />

            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : logs.length === 0 ? (
                <div className="text-gray-400 text-sm">No audit logs found.</div>
            ) : (
                <div className="space-y-3">
                    {logs.map((log) => (
                        <div key={log._id} className="p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm space-y-2">
                            <p className="text-sm text-blue-800 font-semibold mb-2">
                                {log.request?.method} - {log.request?.url}
                            </p>
                            <div className="text-xs text-gray-700 space-y-1">
                                <p><strong>Status:</strong> {log.response?.statusCode}</p>
                                <p><strong>IP:</strong> {log?.ipAddress}</p>
                                <p><strong>User :</strong> {log?.userId}</p>
                                <p><strong>Time:</strong> {new Date(log?.timestamp).toLocaleString()}</p>
                                <p><strong>Response Time:</strong> {log?.responseTime}</p>
                            </div>

                            {log.request?.deviceInfo && (
                                <JsonBlock title="Request Device Info" data={log.request?.deviceInfo} />
                            )}
                            {log.request?.query && Object.keys(log.request.query).length > 0 && (
                                <JsonBlock title="Query Params" data={log.request?.query} />
                            )}
                            {log.response?.body && (
                                <JsonBlock title="Response Body" data={log.response?.body} />
                            )}
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

export default AuditLogs;
