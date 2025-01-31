import React from "react";
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ icon, label, rights, actionName, actionUrl }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${actionUrl}`, { state: { rights, actionName } }); 
    };

    return (
        <div
            onClick={handleClick}
            className="flex relative gap-2.5 text-neutral-800 text-opacity-70 cursor-pointer hover:text-indigo-500"
        >
            <img
                loading="lazy"
                src={icon}
                alt=""
                className="object-contain shrink-0 w-6 aspect-square"
            />
            <div className="basis-auto">{label}</div>
        </div>
    );
};

export default SidebarItem;
