import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAnalytics } from '../../../services/doctors';
import AppointmentCard from '../../../components/Atoms/Overview/AppointmentCard';
import WeeklyBookingOverview from '../../../components/Atoms/Doctor/WeeklyBookingOverview';

const Overview = () => {
    const [selectedClinicId, setSelectedClinicId] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);

    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const doctorId = userDetails?.doctorId;

    useEffect(() => {
        const handleClinicChange = (e) => {
            const newClinicId = e.detail;
            setSelectedClinicId(newClinicId);
        };
        window.addEventListener('clinicIdChanged', handleClinicChange);
        return () => {
            window.removeEventListener('clinicIdChanged', handleClinicChange);
        };
    }, []);

    useEffect(() => {
        if (selectedClinicId) {
            fetchAnalytics(selectedClinicId);
        }
    }, [selectedClinicId]);

    useEffect(() => {
        const storedClinicId = JSON.parse(localStorage.getItem('selectedClinicId'));
        if (storedClinicId) setSelectedClinicId(storedClinicId);
    }, []);

    const fetchAnalytics = async (clinicId) => {
        try {
            const result = await getAnalytics(doctorId, clinicId);
            setAnalyticsData(result?.data.analytics || {});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch analytics");
        }
    };

    useEffect(() => {
        if (selectedClinicId) {
            fetchAnalytics(selectedClinicId);
        }
    }, [selectedClinicId]);

    return (
        <div className="p-4">
            {analyticsData ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <AppointmentCard appt={analyticsData.upcomingAppointments} title="Appointments Upcoming" />
                        <AppointmentCard appt={analyticsData.totalPatients} title="Total Patients" />
                        <AppointmentCard appt={analyticsData.reportedPatients} title="Reported Patients" />
                        <AppointmentCard appt={analyticsData.todayCompleted} title="Completed Today" />
                        <AppointmentCard appt={analyticsData.todayVisits} title="Today's Visits" />
                        <AppointmentCard appt={analyticsData.newPatientsToday} title="New Patients Today" />
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Booked Appointments</h2>
                        {analyticsData.bookedAppointmentsToday?.length > 0 ? (
                            <ul className="space-y-4">
                                {analyticsData?.bookedAppointmentsToday?.map((appt, index) => (
                                    <li
                                        key={index}
                                        className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm"
                                    >
                                        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                            {appt.firstName} {appt.middleName || ''} {appt.lastName}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Reason: {appt.reasonForVisit || 'N/A'}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No booked appointments for today.</p>
                        )}
                    </div>
                    <WeeklyBookingOverview bookingRatio={analyticsData.weeklyBookingRatio} />
                </>
            ) : (
                <p className="text-gray-500">Loading.</p>
            )}
        </div>
    );
};

export default Overview;
