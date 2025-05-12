import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import SideBar from '../../components/Organs/SideBar';
import { Toaster } from 'react-hot-toast';

const ControlPanel = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const scrollRef = useRef(null);
    const { pathname } = useLocation();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSidebarOpen(window.innerWidth >= 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [pathname]);

    return (
        <div className="flex h-screen overflow-hidden">
            <Toaster />
            <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div
                ref={scrollRef}
                className={`flex-1 transition-all duration-300 ease-in-out overflow-auto pt-[64px] p-4 
                ${isSidebarOpen ? "lg:ml-[300px]" : "lg:ml-[100px]"}`}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default ControlPanel;
