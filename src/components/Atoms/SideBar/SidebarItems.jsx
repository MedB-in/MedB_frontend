import React from 'react';

function SidebarItem({ icon, label }) {
    return (
        <div className="flex relative gap-2.5 text-neutral-800 text-opacity-70 cursor-pointer hover:text-indigo-500">
            <img
                loading="lazy"
                src={icon}
                alt=""
                className="object-contain shrink-0 w-6 aspect-square"
            />
            <div className="basis-auto">{label}</div>
        </div>
    );
}

export default SidebarItem;
