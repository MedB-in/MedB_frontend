import React from 'react'
import AppointmentCard from '../../../components/Atoms/Overview/AppointmentCard'
import { Reports } from '../../../components/Atoms/Overview/Reports'
import DoctorList from '../../../components/Atoms/Overview/DoctorList'
import Calendar from '../../../components/Atoms/Overview/Calender';
import PatientFeedback from '../../../components/Atoms/Overview/PatientFeedback';

function Overview() {

    const doctors = [
        { name: "Sumith Kk", qualification: "MBBS, MD", available: true },
        { name: "Sumith Kk", qualification: "MBBS, MD", available: false },
        { name: "Sumith Kk", qualification: "MBBS, MD", available: true },
        { name: "Sumith Kk", qualification: "MBBS, MD", available: true },
    ];

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
                    <AppointmentCard />
                </div>
                <div className="flex-1">
                    <AppointmentCard />
                </div>
                <div className="flex-1">
                    <AppointmentCard />
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
