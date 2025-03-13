import { Outlet } from 'react-router-dom';
import React from 'react'
import SideBar from '../../components/Organs/SideBar';
import { Toaster } from 'react-hot-toast';

const ControlPanel = () => {
    return (
        <>
            <Toaster />
            <SideBar />
            <main className="bg-white ml-[280px] pt-[85px] overflow-auto">
                <section>
                    <Outlet />
                </section>
            </main>
        </>
    )
}

export default ControlPanel;
