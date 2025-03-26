import { Outlet } from 'react-router-dom';
import React, { useState } from 'react';
import SideBar from '../../components/Organs/SideBar';
import { Toaster } from 'react-hot-toast';

const ControlPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            <Toaster />
            <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div
                className={`flex-1 transition-all duration-300 ease-in-out overflow-auto pt-[64px] p-4 
                ${isSidebarOpen ? "lg:ml-[300px]" : "lg:ml-[100px]"}`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default ControlPanel;
