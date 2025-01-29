import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SidebarItem from '../Atoms/SideBar/SidebarItems';

function SideBar() {
    const userAccess = useSelector((state) => state.userAccess.userAccess);
    const modules = userAccess?.get_user_menu || [];

    const [openModuleIndex, setOpenModuleIndex] = useState(null);

    const toggleModule = (index) => {
        setOpenModuleIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <div className="flex flex-col text-base font-medium rounded-none w-[239px] bg-white shadow-md">
            <div className="flex relative flex-col px-6 pt-28 pb-96 w-full rounded-none">
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
                                            className={`relative ${menuIndex > 0 ? 'mt-4' : ''}`}
                                        >
                                            <SidebarItem
                                                icon={menu.menuIcon}
                                                label={menu.menuName}
                                                rights={menu.rights}
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
