import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LeaveManagement from "../../../components/Organs/Doctors/LeaveMangement";
import FeeMangement from "../../../components/Organs/Doctors/FeeManagement";
import BackButton from "../../../components/Atoms/BackButton";

const tabs = [
    { label: "Leave Management", key: "leave" },
    { label: "Fee Management", key: "fee" },
];

const LeaveMangementPage = () => {
    const [activeTab, setActiveTab] = useState("leave");

    return (
        <div className="p-4">
            <BackButton />
            <div className="flex gap-4 border-b border-gray-300">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative px-4 py-2 font-medium transition-colors ${activeTab === tab.key
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-blue-500"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.key && (
                            <motion.div
                                layoutId="underline"
                                className="absolute left-0 right-0 -bottom-1 h-[2px] bg-blue-600 rounded-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                <AnimatePresence mode="wait">
                    {activeTab === "leave" && (
                        <motion.div
                            key="leave"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <LeaveManagement />
                        </motion.div>
                    )}

                    {activeTab === "fee" && (
                        <motion.div
                            key="fee"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FeeMangement />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LeaveMangementPage;
