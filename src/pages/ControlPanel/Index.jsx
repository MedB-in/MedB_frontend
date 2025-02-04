import { Outlet } from 'react-router-dom';
import React from 'react'
import Header from '../../components/Organs/Header';
import SideBar from '../../components/Organs/SideBar';

const ControlPanel = () => {
    return (
        <>
            <Header />
            <SideBar />
            <main className="bg-white ml-[270px] pt-24 overflow-auto">
                <section>
                    <Outlet />
                </section>
            </main>
        </>
    )
}

export default ControlPanel;
