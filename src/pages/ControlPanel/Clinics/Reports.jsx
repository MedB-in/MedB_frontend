import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getReports } from "../../../services/clinics";
import toast from "react-hot-toast";

const ReportTabs = ["weekly", "monthly", "yearly"];
const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const monthLabels = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const Reports = () => {
    const [activeTab, setActiveTab] = useState("weekly");
    const [reportData, setReportData] = useState({});
    const [loading, setLoading] = useState(false);
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const clinicId = userDetails?.clinicId;

    const yearLabels = Array.from(new Set(
        Object.values(reportData)
            .flat()
            .map((entry) => entry.year?.toString())
    ));

    const labels = activeTab === "weekly" ? dayLabels
        : activeTab === "monthly" ? monthLabels
            : yearLabels;

    useEffect(() => {
        if (!clinicId) return;

        const fetchReports = async () => {
            setLoading(true);
            try {
                const response = await getReports(clinicId, activeTab);
                setReportData(response.data.data || {});
            } catch (err) {
                toast.error("Failed to fetch report data");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [clinicId, activeTab]);

    const renderSkeleton = () => (
        <tbody>
            {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    <td className="px-4 py-2 bg-gray-100 w-32 h-4 rounded-md" />
                    {labels.map((_, j) => (
                        <td key={j} className="px-4 py-2 bg-gray-100 w-20 h-4 rounded-md" />
                    ))}
                </tr>
            ))}
        </tbody>
    );
    const renderData = () => (
        Object.entries(reportData).map(([doctorName, entries]) => (
            <tr key={doctorName} className="bg-white border-t hover:bg-gray-50 transition-all duration-200">
                <td className="px-4 py-2 border-r">
                    <div className="relative z-[1] text-center">
                        <span className="font-bold text-[13px] text-blue-600 tracking-[0.78px] capitalize mt-1.5">
                            Dr.{doctorName}
                        </span>
                    </div>
                </td>
                {labels.map((label, idx) => {
                    const entry = entries.find((e) => {
                        if (activeTab === "weekly") {
                            return e.day?.trim().toLowerCase() === label.toLowerCase();
                        } else if (activeTab === "monthly") {
                            return e.month?.trim().toLowerCase() === label.toLowerCase();
                        } else if (activeTab === "yearly") {
                            return e.year?.toString() === label;
                        }
                        return false;
                    });

                    return (
                        <td key={idx} className="text-center px-4 py-2 border-r">
                            <div className="relative w-[120px] h-[60px] mt-[5px] mx-auto">
                                <div className="w-full h-full shadow-[0px_-2px_0px_0px_rgba(0,0,0,0.25)] absolute bg-purple-100 rounded-[5px] left-0 top-0" />
                                <span className="font-normal text-[12px] text-black tracking-[0.75px] absolute left-[12px] top-1.5">
                                    Total Slots
                                </span>
                                <span className="font-bold text-[15px] text-black tracking-[0.9px] absolute left-[12px] bottom-3">
                                    {entry ? entry.totalSlots : 0}
                                </span>
                                <span className="font-normal text-[10px] text-[rgba(0,0,0,0.90)] tracking-[0.6px] absolute left-[12px] bottom-0">
                                    Appointments: {entry ? entry.completedAppointments : 0}
                                </span>
                            </div>
                        </td>
                    );
                })}
            </tr>
        ))
    );


    return (
        <div className="backdrop-blur-md bg-white/30 border border-white/20 shadow-2xl rounded-2xl p-6 min-h-[460px] my-5 transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm">
                    Doctor Appointment Reports
                </h2>
                <div className="flex gap-2">
                    {ReportTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full text-sm capitalize transition-all duration-300 border shadow-sm font-medium ${activeTab === tab
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white/70 text-gray-700 border-gray-300 hover:bg-blue-100 hover:text-blue-600"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="overflow-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                <tr>
                                    <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 border-r text-left font-semibold">
                                        Doctor
                                    </th>
                                    {labels.map((label, idx) => (
                                        <th
                                            key={idx}
                                            className="text-center px-4 py-3 border-r font-semibold whitespace-nowrap"
                                        >
                                            {label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            {loading ? renderSkeleton() : <tbody>{renderData()}</tbody>}
                        </table>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
export default Reports;