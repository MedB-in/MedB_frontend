import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuditLogs from "../../../components/Organs/AppLogs/AuditLogs";
import ErrorLogs from "../../../components/Organs/AppLogs/ErrorLogs";
import EmailLogs from "../../../components/Organs/AppLogs/EmailLogs";
import UserSearch from "../../../components/Organs/AppLogs/UserSearch";
import TimeRangeSelector from "../../../components/Organs/AppLogs/TimeRangeSelector";

const tabs = [
    { id: "error", label: "Error Logs" },
    { id: "audit", label: "Audit Logs" },
    { id: "email", label: "Email Logs" },
];

const AppLogs = () => {
    const [activeTab, setActiveTab] = useState("error");
    const [selectedUser, setSelectedUser] = useState(null);

    const [timeFrom, setTimeFrom] = useState("");
    const [timeTo, setTimeTo] = useState("");

    const renderTabContent = () => {
        const props = {
            userId: selectedUser?.userId,
            email: selectedUser?.email,
            timeFrom,
            timeTo,
        };

        switch (activeTab) {
            case "error":
                return <ErrorLogs {...props} />;
            case "audit":
                return <AuditLogs {...props} />;
            case "email":
                return <EmailLogs {...props} />;
            default:
                return null;
        }
    };

    return (
        <div className="mx-auto mt-10 px-4 max-w-6xl">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl shadow-md w-full mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative w-full py-2 text-sm font-medium rounded-lg transition-all duration-300 ${activeTab === tab.id
                                ? "bg-white shadow text-black"
                                : "text-gray-500 hover:bg-white/70"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mb-6">
                <UserSearch onSelectUser={(user) => setSelectedUser(user)} />
            </div>

            {selectedUser && (
                <div className="mb-4">
                    <TimeRangeSelector
                        timeFrom={timeFrom}
                        timeTo={timeTo}
                        setTimeFrom={setTimeFrom}
                        setTimeTo={setTimeTo}
                    />
                </div>
            )}

            <div className="min-h-[400px] bg-white p-6 rounded-xl shadow">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + JSON.stringify(selectedUser)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {selectedUser ? (
                            renderTabContent()
                        ) : (
                            <p className="text-gray-500 text-sm text-center">
                                Please select a user to view logs.
                            </p>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AppLogs;
