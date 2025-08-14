import { useState, useEffect } from "react";
import { getMessages } from "../../../services/user";
import toast from "react-hot-toast";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await getMessages(page, search);
            setMessages(res.data.data.data);
            setTotalPages(res.data.data.pages);
        } catch (error) {
            toast.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [page, search]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">WhatsApp Messages</h2>

            <input
                type="text"
                value={search}
                onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                }}
                placeholder="Search by phone or message..."
                className="border p-2 mb-4 w-full rounded"
            />

            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Phone</th>
                            <th className="border p-2">Date & Time</th>
                            <th className="border p-2">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length > 0 ? (
                            messages.map((msg) => (
                                <tr key={msg._id}>
                                    <td className="border p-2">{msg.phone}</td>
                                    <td className="border p-2">
                                        {new Date(msg.datetime).toLocaleString("en-IN", {
                                            timeZone: "Asia/Kolkata"
                                        })}
                                    </td>
                                    <td className="border p-2">{msg.message}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-4 text-center">
                                    No messages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            <div className="flex justify-center mt-4 gap-2">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Messages;