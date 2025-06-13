import React, { useState, useEffect } from "react";
import { getMenu } from "../../../services/controlPanel";
import ModuleModal from "../../../components/Organs/MenuManagement/ModuleModal";
import MenuModal from "../../../components/Organs/MenuManagement/MenuModal";
import toast, { Toaster } from "react-hot-toast";
import { ChevronDown } from "lucide-react";

const MenuManagementPage = () => {
    const [menus, setMenus] = useState([]);
    const [selectedModule, setSelectedModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [moduleData, setModuleData] = useState(null);
    const [menuData, setMenuData] = useState(null);

    const fetchMenus = async () => {
        setLoading(true);
        setError(null);
        try {
            const menuData = await getMenu();
            setMenus(menuData.data.menuData || []);
        } catch (err) {
            setError("Failed to fetch menus");
            toast.error("Failed to fetch menus");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const handleAddModule = () => {
        setModuleData(null);
        setIsModuleModalOpen(true);
    };

    const handleAddMenu = () => {
        setMenuData(null);
        setIsMenuModalOpen(true);
    };

    const handleEditModule = (moduleId) => {
        const moduleToEdit = menus.find((module) => module.moduleId === moduleId);
        setModuleData(moduleToEdit);
        setIsModuleModalOpen(true);
    };

    const handleEditMenu = (menuId, moduleId) => {
        const menuToEdit = menus.flatMap(m => m.menus || []).find(menu => menu.menuId === menuId);

        if (menuToEdit) {
            setMenuData({ ...menuToEdit, moduleId });
        }

        setIsMenuModalOpen(true);
    };

    const handleModuleClick = (moduleId) => {
        setSelectedModule((prevModule) => prevModule === moduleId ? null : moduleId);
    };

    const handleSubmit = async () => {
        await fetchMenus();
    };

    return (
        <section className="p-4">
            <Toaster />
            <div className="overflow-x-auto">
                <div className="flex justify-center gap-5 items-center py-4 px-4">
                    <button className="py-2 px-4 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300" onClick={handleAddModule}>
                        Add Module
                    </button>
                    <button className="py-2 px-4 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300" onClick={handleAddMenu}>
                        Add Menu
                    </button>
                </div>
                {loading && <p className="text-center">Loading menus...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
                <table className="min-w-full">
                    <tbody>
                        {menus.map((module) => (
                            <React.Fragment key={module?.moduleId}>
                                <tr
                                    className="flex items-center justify-between cursor-pointer py-2 px-4 border-b hover:bg-gray-100 transition-colors"
                                    onClick={() => handleModuleClick(module?.moduleId)}
                                >
                                    <td className="flex items-center gap-4">
                                        {module?.moduleIcon ? (
                                            <img className="w-6 h-6" src={module.moduleIcon} alt={module.moduleName} />
                                        ) : (
                                            <div className="w-6 h-6 bg-gray-300 rounded" />
                                        )}
                                        <span>{module?.moduleName}</span>
                                    </td>
                                    <td className="flex items-center gap-4">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                                            onClick={(e) => { e.stopPropagation(); handleEditModule(module?.moduleId); }}
                                        >
                                            Edit
                                        </button>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${selectedModule === module?.moduleId ? 'transform rotate-180' : ''}`}
                                        />
                                    </td>
                                </tr>

                                {/* Module menus with transition */}
                                {selectedModule === module.moduleId && (
                                    <tr>
                                        <td colSpan={4}>
                                            <div
                                                className={`pl-8 overflow-hidden transition-all duration-300 ease-in-out ${selectedModule === module.moduleId ? 'max-h-[1000px]' : 'max-h-0'}`}
                                            >
                                                <table className="min-w-full">
                                                    <thead>
                                                        <tr className="text-left">
                                                            <th className="py-2 px-4">Menu ID</th>
                                                            <th className="py-2 px-4">Menu Icon</th>
                                                            <th className="py-2 px-4">Menu Name</th>
                                                            <th className="py-2 px-4">Menu Route</th>
                                                            <th className="py-2 px-4">Menu Status</th>
                                                            <th className="py-2 px-4">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(module.menus) && module.menus.length > 0 ? (
                                                            module.menus.map((menu) => (
                                                                <tr key={menu.menuId} className="border-b hover:bg-gray-50 transition-colors">
                                                                    <td className="py-2 px-4">{menu.menuId}</td>
                                                                    <td className="py-2 px-4">
                                                                        {module?.moduleIcon ? (
                                                                            <img className="w-6 h-6" src={menu.menuIcon} alt={menu.menuName} />
                                                                        ) : (
                                                                            <div className="w-6 h-6 bg-gray-300 rounded" />
                                                                        )}
                                                                    </td>
                                                                    <td className="py-2 px-4">{menu.menuName}</td>
                                                                    <td className="py-2 px-4">{menu.controllerName}</td>
                                                                    <td className={`py-2 px-4 ${menu.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                                                        {menu.isActive ? 'Active' : 'Inactive'}
                                                                    </td>
                                                                    <td className="py-2 px-4 flex gap-2">
                                                                        <button
                                                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                                                                            onClick={() => handleEditMenu(menu.menuId, module.moduleId)}
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={6} className="text-center py-2">No menus available for this module.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
            <ModuleModal isOpen={isModuleModalOpen} closeModal={() => setIsModuleModalOpen(false)} moduleData={moduleData} onSubmit={handleSubmit} />
            <MenuModal isOpen={isMenuModalOpen} closeModal={() => setIsMenuModalOpen(false)} menuData={menuData} modules={menus} onSubmit={handleSubmit} />
        </section>
    );
};

export default MenuManagementPage;
