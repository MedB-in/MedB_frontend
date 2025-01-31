import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SidebarItem from '../Atoms/SideBar/SidebarItems';

const SideBar = () => {
    const userAccess = useSelector((state) => state.userAccess.userAccess);
    const modules = userAccess?.get_user_menu || [];

    const [openModuleIndex, setOpenModuleIndex] = useState(null);

    const toggleModule = (index) => {
        setOpenModuleIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className="flex fixed z-40 h-screen transition-all w-[270px] mt-20 overflow-auto">
            <div className="z-20 py-8 px-4 bg-white border-2 w-full border-slate-200">
                {modules.length > 0 ? (
                    modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="mb-6">
                            <div
                                onClick={() => toggleModule(moduleIndex)}
                                className="cursor-pointer flex items-center text-lg font-semibold mb-4 hover:bg-gray-100 p-2 rounded"
                            >
                                <img src={module.moduleIcon} alt={module.moduleName} className="mr-2 w-6 h-6" />
                                {module.moduleName}
                            </div>
                            {openModuleIndex === moduleIndex && (
                                <div>
                                    {module.menus.map((menu, menuIndex) => (
                                        <div
                                            key={menuIndex}
                                            className={`relative px-8 ${menuIndex > 0 ? 'mt-4' : ''}`}
                                        >
                                            <SidebarItem
                                                icon={menu.menuIcon}
                                                label={menu.menuName}
                                                rights={menu.rights}
                                                actionName={menu.actionName}
                                                actionUrl={menu.controllerName}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div>No modules available</div>
                )}
            </div>
        </div>
    );
}

export default SideBar;
