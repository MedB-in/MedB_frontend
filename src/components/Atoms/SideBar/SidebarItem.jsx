import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ icon, label, actionUrl, isSelected, onClick, isSidebarOpen }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${actionUrl}`);
        onClick();
    };

    return (
        <div
            onClick={handleClick}
            className={`relative flex items-center gap-2.5 mb-2 text-neutral-800 text-opacity-70 cursor-pointer hover:text-[#257c7c] transition-all 
                ${isSelected ? "font-bold bg-white rounded-l-[20px] w-[calc(100%+16px)] pl-8 p-2" : "p-2"}`}
        >
            <img
                loading="lazy"
                src={icon}
                alt={label}
                className="object-contain shrink-0 w-6 aspect-square transition-all duration-300 ease-in-out"
            />
            <div
                className={`transition-all duration-300 ease-in-out delay-150 transform 
                    ${isSidebarOpen ? "opacity-100 translate-x-0  relative" : "opacity-0 translate-x-[-10px] absolute"}`}
            >
                {label}
            </div>
        </div>
    );
};

export default SidebarItem;
