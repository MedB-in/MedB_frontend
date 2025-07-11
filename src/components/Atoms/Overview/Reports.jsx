import days from "../../../lib/slotDays";
import DoctorsBookingRatio from "../Clinic/DoctorsBookingRatio";
// import ExpensesDonutChart from "../Clinic/ExpensesDonutChart";
import WeeklyBookingOverview from "../Clinic/WeeklyBookingOverview";

const Reports = ({ weeklyAppointments, doctorRatios, todaySlots }) => {

    return (
        <div className="bg-white border p-6 rounded-lg min-h-[460px] border-solid my-5 shadow-lg border-[rgba(0,0,0,0.1)]">
            <h2 className="text-[19px] font-bold mb-5  text-center">Appointment Reports</h2>

            <div className="p-6 rounded-[14px] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* <ExpensesDonutChart /> */}
                <div>
                    <WeeklyBookingOverview
                        weeklyAppointments={weeklyAppointments}
                        days={days}
                    />
                </div>
                <DoctorsBookingRatio doctorRatios={doctorRatios} todaySlots={todaySlots} />
            </div>
        </div>
    );
};

export default Reports;