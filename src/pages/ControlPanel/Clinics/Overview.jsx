import AppointmentCard from '../../../components/Atoms/Overview/AppointmentCard'
import Reports from '../../../components/Atoms/Overview/Reports'
import DoctorList from '../../../components/Atoms/Overview/DoctorList'
import Calendar from '../../../components/Atoms/Overview/Calender';
import PatientFeedback from '../../../components/Atoms/Overview/PatientFeedback';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAnalytics } from '../../../services/clinics';

const Overview = () => {

    const [todaysAppointments, setTodaysAppointments] = useState(null);
    const [totalAppointments, setTotalAppointments] = useState(null);
    const [upcomingAppointments, setUpcomingAppointments] = useState(null);
    const [doctors, setDoctors] = useState([]);
    // const [expenses, setExpenses] = useState([]);
    // const [feedbacks, setFeedbacks] = useState([]);

    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const clinicId = userDetails?.clinicId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAnalytics(clinicId);
                setTodaysAppointments(result.data.clinics.todayAppointments);
                setTotalAppointments(result.data.clinics.totalAppointments);
                setUpcomingAppointments(result.data.clinics.upcomingAppointments);
                setDoctors(result.data.clinics.doctors);
                // setExpenses(result.expenses);
            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        }

        fetchData();
    }, [clinicId]);


    const feedbacks = [
        {
            name: "Sinan Kk",
            image: {},
            feedback: "is simply dummy text of the printing and typesetting industry.",
            rating: 3,
        },
        {
            name: "Sinan Kk",
            image: {},
            feedback: "is simply dummy text of the printing and typesetting industry.",
            rating: 3,
        },
        {
            name: "Sinan Kk",
            image: {},
            feedback: "is simply dummy text of the printing and typesetting industry.",
            rating: 3,
        },
    ];

    return (
        <>
            <div className="flex gap-4 w-full mb-6">
                <div className="flex-1">
                    <AppointmentCard appt={todaysAppointments} title={"Today's Appointments"} />
                </div>
                <div className="flex-1">
                    <AppointmentCard appt={totalAppointments} title={"Total Appointments"} />
                </div>
                <div className="flex-1">
                    <AppointmentCard appt={upcomingAppointments} title={"Upcoming Appointments"} />
                </div>
            </div>
            <div className="flex gap-4 w-full mb-6">
                <div className="w-2/3">
                    <Reports />
                </div>
                <div className="w-1/3">
                    <DoctorList doctors={doctors} />
                </div>
            </div>
            <div className="flex justify-center w-full">
                <div className="flex gap-6 w-[1200px] max-w-full h-full">
                    <div className="flex-1 h-full">
                        <Calendar />
                    </div>
                    <div className="flex-1 h-full">
                        <PatientFeedback feedbacks={feedbacks} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Overview
