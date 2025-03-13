import notebook from "../../../assets/images/notebook-02.png";
import whatsapp from "../../../assets/images/whatsapp-icon.png";

const FloatingActionButtons = () => {
    return (
        <>
            <div
                className="fixed right-0 top-[40dvh] flex items-center bg-[#6F64E7] text-white rounded-l-lg p-2 z-50 cursor-pointer hover:opacity-90"
                title="Send us a message"
            >
                <img src={notebook} alt="Message" className="w-8 h-8 object-contain" />
            </div>
            <a
                href="https://api.whatsapp.com/send/?phone=8137854445&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed right-0 top-[50dvh] flex items-center bg-[#17B958] text-white rounded-l-lg p-2 z-50 cursor-pointer hover:opacity-90"
                title="Chat on WhatsApp"
            >
                <img src={whatsapp} alt="WhatsApp" className="w-8 h-8 object-contain" />
            </a>
        </>
    );
};

export default FloatingActionButtons;
