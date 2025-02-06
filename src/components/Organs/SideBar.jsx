import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react'; 
import SidebarItem from '../Atoms/SideBar/SidebarItems';

const SideBar = () => {
    const userAccess = useSelector((state) => state.userAccess.userAccess);
    const modules = userAccess || [];
    const location = useLocation();

    const [openModuleIndex, setOpenModuleIndex] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);

    useEffect(() => {
        const storedOpenModuleIndex = localStorage.getItem('openModuleIndex');
        const storedSelectedMenu = localStorage.getItem('selectedMenu');

        if (storedOpenModuleIndex !== null) {
            setOpenModuleIndex(Number(storedOpenModuleIndex));
        }

        if (storedSelectedMenu) {
            setSelectedMenu(storedSelectedMenu);
        }
    }, []);

    useEffect(() => {
        if (openModuleIndex !== null) {
            localStorage.setItem('openModuleIndex', openModuleIndex);
        }

        if (selectedMenu) {
            localStorage.setItem('selectedMenu', selectedMenu);
        }
    }, [openModuleIndex, selectedMenu]);

    const toggleModule = (index) => {
        setOpenModuleIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu.actionUrl);
    };

    return (
        <div className="flex fixed z-40 h-screen transition-all w-[270px] mt-20 overflow-auto bg-white shadow-lg">
            <div className="py-8 px-4 w-full border-r border-slate-200">
                {modules.length > 0 ? (
                    modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="mb-6">
                            <div
                                onClick={() => toggleModule(moduleIndex)}
                                className="cursor-pointer flex items-center justify-between text-lg font-semibold mb-4 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                            >
                                <div className="flex items-center">
                                    <img src={module.moduleIcon} alt={module.moduleName} className="mr-2 w-6 h-6" />
                                    {module.moduleName}
                                </div>
                                <div className="text-gray-600">
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-300 ${openModuleIndex === moduleIndex ? 'transform rotate-180' : ''}`}
                                    />
                                </div>
                            </div>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openModuleIndex === moduleIndex ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                <div className="pl-8">
                                    {module.menus.map((menu, menuIndex) => (
                                        <div
                                            key={menuIndex}
                                            className={`relative ${menuIndex > 0 ? 'mt-4' : ''} transition-all`}
                                        >
                                            <SidebarItem
                                                icon={menu.menuIcon}
                                                label={menu.menuName}
                                                rights={menu.rights}
                                                actionName={menu.actionName}
                                                actionUrl={menu.controllerName}
                                                isSelected={selectedMenu === menu.controllerName || location.pathname.split("/")[1] === menu.controllerName}
                                                onClick={() => handleMenuClick(menu)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No modules available</div>
                )}
            </div>
        </div>
    );
};

export default SideBar;
