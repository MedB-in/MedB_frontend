import { useEffect, useState } from "react";
import { getSuperStatistics } from "../../services/controlPanel";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const tabs = ["daily", "weekly", "monthly"];

const ChartCard = ({ title, data, color }) => (
    <div className="bg-white rounded-xl p-4 shadow-md">
        <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
        <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const HighlightCard = ({ title, value, color = "indigo" }) => {
    const styles = colorClasses[color] || colorClasses["indigo"];

    return (
        <div
            className={`w-full text-center rounded-2xl p-6 font-semibold text-lg shadow-sm 
                  ${styles.bg} ${styles.border} ${styles.text}`}
        >
            {title}: <span className="text-2xl">{value ?? 0}</span>
        </div>
    );
};

const colorClasses = {
    sky: {
        bg: "bg-sky-100",
        border: "border-sky-300",
        text: "text-sky-800",
    },
    teal: {
        bg: "bg-teal-100",
        border: "border-teal-300",
        text: "text-teal-800",
    },
    amber: {
        bg: "bg-amber-100",
        border: "border-amber-300",
        text: "text-amber-800",
    },
    indigo: {
        bg: "bg-indigo-100",
        border: "border-indigo-300",
        text: "text-indigo-800",
    },
};


const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("daily");
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getSuperStatistics();
                setStats(response.data || {});
            } catch (error) {
                console.error("Error fetching statistics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const renderCharts = (prefix) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {activeTab === "daily" && (
                <>
                    <HighlightCard title="Active Users Online" value={stats.activeUsers} color="sky" />
                    <HighlightCard title="Active Clinics" value={stats.activeClinics} color="teal" />
                    <HighlightCard title="Active Doctors" value={stats.activeDoctors} color="amber" />
                </>
            )}
            <ChartCard
                title="Patient Signups"
                data={stats[`${prefix}Signups`] || []}
                color="#4f46e5"
            />
            <ChartCard
                title="Logged-in Users"
                data={stats[`${prefix}LoggedInUsers`] || []}
                color="#059669"
            />
            <ChartCard
                title="Clinics Registration Requests"
                data={stats[`${prefix}ClinicRegistrationRequests`] || []}
                color="#d97706"
            />
            <ChartCard
                title="Clinics Added/Approved"
                data={stats[`${prefix}Clinics`] || []}
                color="#d97706"
            />
            <ChartCard
                title="Doctors Added"
                data={stats[`${prefix}Doctors`] || []}
                color="#db2777"
            />
            <ChartCard
                title="Enquiries"
                data={stats[`${prefix}Enquiries`] || []}
                color="#6366f1"
            />
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex gap-4 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`capitalize px-4 py-2 rounded-full font-medium transition ${activeTab === tab
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500 font-medium">
                    Loading dashboard data...
                </div>
            ) : (
                <>
                    {activeTab === "daily" && renderCharts("daily")}
                    {activeTab === "weekly" && renderCharts("weekly")}
                    {activeTab === "monthly" && renderCharts("monthly")}
                </>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
