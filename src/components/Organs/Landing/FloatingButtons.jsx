import notebook from "../../../assets/images/notebook-02.png";
import whatsapp from "../../../assets/images/whatsapp-icon.png";
import { useNavigate } from "react-router-dom";

const FloatingActionButtons = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* <div
                className="fixed right-0 md:top-[73dvh] top-[70dvh] flex items-center bg-[#6F64E7] text-white rounded-l-lg p-1 md:p-2 z-50 cursor-pointer hover:opacity-90"
                title="Book An Appointment"
            >
                <img src={notebook} alt="Message" className="w-6 h-6 md:w-8 md:h-8 object-contain" onClick={() => navigate('/find-doctor-clinic')} />
            </div>
            <a
                href="https://api.whatsapp.com/send/?phone=8137854445&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed right-0 top-[76dvh] md:top-[80dvh] flex items-center bg-[#17B958] text-white rounded-l-lg p-1 md:p-2 z-50 cursor-pointer hover:opacity-90"
                title="Chat on WhatsApp"
            >
                <img src={whatsapp} alt="WhatsApp" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
            </a> */}


            <div
                className="fixed right-0 md:top-[73dvh] top-[70dvh] flex items-center z-50 group"
            >
                <div
                    onClick={() => navigate('/find-doctor-clinic')}
                    className="flex items-center bg-[#6F64E7] text-white rounded-l-full px-2 md:px-3 py-1 transition-all duration-300 ease-in-out cursor-pointer hover:pr-6"
                >
                    <span className="opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[200px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap text-sm md:text-base mr-2">
                        Book Appointment
                    </span>
                    <img src={notebook} alt="Message" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                </div>
            </div>

            <div
                className="fixed right-0 top-[76dvh] md:top-[80dvh] flex items-center z-50 group"
            >
                <a
                    href="https://api.whatsapp.com/send/?phone=8137854445&text&type=phone_number&app_absent=0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-[#17B958] text-white rounded-l-full px-2 md:px-3 py-1 transition-all duration-300 ease-in-out cursor-pointer hover:pr-6"
                >
                    <span className="opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-[200px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap text-sm md:text-base mr-2">
                        Chat on WhatsApp
                    </span>
                    <img src={whatsapp} alt="WhatsApp" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                </a>
            </div>

        </>
    );
};

export default FloatingActionButtons;
