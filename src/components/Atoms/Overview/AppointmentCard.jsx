import { useNavigate } from "react-router-dom";

const AppointmentCard = ({ appt, title }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        if (title === "Upcoming Appointments") {
            navigate("/app/appointments/appointments-management?status=upcoming");
        } else if (title === "Today's Appointments") {
            navigate("/app/appointments/appointments-management");
        }
    };

    return (
        <article className="flex flex-col items-center p-6 rounded-xl border border-emerald-300 border-solid my-5 shadow-lg bg-indigo-500 bg-opacity-10">
            <h2
                className="text-7xl font-bold text-indigo-500"
                aria-label="180 appointments"
            >
                {appt ? appt : "0"}
            </h2>
            <p className="text-xl my-6">{title}</p>
            <button
                className={`flex justify-end items-center pr-5 mt-auto w-full h-10 bg-emerald-300 rounded-xl cursor-default ${(title === "Today's Appointments" || title === "Upcoming Appointments")
                    ? " hover:bg-emerald-400 transition-colors cursor-pointer"
                    : ""
                    }`}

                aria-label="View appointments"
                onClick={handleClick}
            >
                {title === "Today's Appointments" || title === "Upcoming Appointments" ? (
                    <svg
                        width="30"
                        height="25"
                        viewBox="0 0 30 25"
                        fill="none"
                        className="w-[29px] h-[24px]"
                        aria-hidden="true"
                    >
                        <path
                            d="M22.0872 12.4432H7.57202"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M17.7327 8.87781L22.0872 12.4433L17.7327 16.0087"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                ) : <></>
                }
            </button>
        </article >
    )
}

export default AppointmentCard