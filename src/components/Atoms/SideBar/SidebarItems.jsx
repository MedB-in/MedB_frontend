import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ icon, label, actionUrl, isSelected, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${actionUrl}`);
        onClick(); 
    };

    return (
        <div
            onClick={handleClick}
            className={`flex relative gap-2.5 text-neutral-800 text-opacity-70 cursor-pointer hover:text-indigo-500 ${isSelected ? "text-rose-500 font-bold" : ""}`}
        >
            <img
                loading="lazy"
                src={icon}
                alt={label}
                className="object-contain shrink-0 w-6 aspect-square"
            />
            <div className="basis-auto">{label}</div>
        </div>
    );
};

export default SidebarItem;
