import { useState, useEffect } from "react";
import { addMenu, editMenu } from "../../../services/controlPanel";
import toast from "react-hot-toast";

const MenuModal = ({ isOpen, closeModal, menuData, onSubmit, modules }) => {
    const [menuName, setMenuName] = useState("");
    const [loading, setLoading] = useState(false);
    const [actionName, setActionName] = useState("");
    const [controllerName, setControllerName] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [sortOrder, setSortOrder] = useState("");
    const [menuIcon, setMenuIcon] = useState("");
    const [moduleId, setModuleId] = useState("");

    useEffect(() => {
        if (menuData) {
            setMenuName(menuData.menuName || "");
            setActionName(menuData.actionName || "");
            setControllerName(menuData.controllerName || "");
            setIsActive(menuData.isActive !== undefined ? menuData.isActive : true);
            setSortOrder(menuData.sortOrder || "");
            setMenuIcon(menuData.menuIcon || "");
            setModuleId(menuData.moduleId || "");
        }
    }, [menuData]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = {
            moduleId,
            menuId: menuData?.menuId || null,
            menuName,
            actionName,
            controllerName,
            isActive,
            sortOrder: parseInt(sortOrder),
            menuIcon,
        };

        if (data.menuName && data.actionName && data.controllerName && data.moduleId) {
            try {
                const menuNameRegex = /^[A-Za-z][A-Za-z0-9\s]{1,49}$/;
                if (!menuNameRegex.test(data.menuName)) {
                    toast.error("Menu name must start with a letter and be 2-50 characters long (letters, numbers, spaces).");
                    setLoading(false);
                    return;
                }
                if (data.menuId) {
                    const response = await editMenu(data.menuId, data);
                    toast.success(response.data.message);
                } else {
                    const response = await addMenu(data);
                    toast.success(response.data.message);
                }
                onSubmit();
                handleCancel();
            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("Please fill out all required fields.");
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setMenuName("");
        setActionName("");
        setControllerName("");
        setIsActive(true);
        setSortOrder("");
        setMenuIcon("");
        setModuleId("");
        closeModal();
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-md shadow-lg w-96">
                    <h3 className="text-xl font-semibold mb-4">
                        {menuData ? "Edit Menu" : "Add New Menu"}
                    </h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Module</label>
                            <select
                                value={moduleId}
                                onChange={(e) => setModuleId(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            >
                                <option value="" disabled>Select a module</option>
                                {modules && modules.map((module) => (
                                    <option key={module.moduleId} value={module.moduleId}>
                                        {module.moduleName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Menu Name</label>
                            <input
                                type="text"
                                value={menuName}
                                onChange={(e) => setMenuName(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Action Name</label>
                            <input
                                type="text"
                                value={actionName}
                                onChange={(e) => setActionName(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Menu Route</label>
                            <input
                                type="text"
                                value={controllerName}
                                onChange={(e) => setControllerName(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Menu Icon URL</label>
                            <input
                                type="url"
                                value={menuIcon}
                                onChange={(e) => setMenuIcon(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Sort Order</label>
                            <input
                                type="number"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="form-checkbox"
                                />
                                <span>Active</span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-500 text-white rounded-md"
                                disabled={loading}
                            >
                                {menuData ? "Update" : "Add Menu"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default MenuModal;
