import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const MenuManagementPage = () => {
    const location = useLocation();
    const { rights = {}, actionName } = location.state || {}; 

    const [menuList, setMenuList] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(''); 
    const [moduleId, setModuleId] = useState('');
    const [menuName, setMenuName] = useState('');
    const [actionUrl, setActionUrl] = useState('');
    const [controllerName, setControllerName] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [sortOrder, setSortOrder] = useState('');
    const [menuIcon, setMenuIcon] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch all menus for the dropdown
    const fetchMenus = async () => {
        try {
            const response = await axios.get("/api/menu"); 
            setMenuList(response.data.data);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    // Fetch menu details if editing or deleting
    const fetchMenuData = async (menuId) => {
        try {
            const response = await axios.get(`/api/menu/${menuId}`);
            const data = response.data.data;
            setModuleId(data.moduleId || '');
            setMenuName(data.menuName || '');
            setActionUrl(data.actionName || '');
            setControllerName(data.controllerName || '');
            setIsActive(data.isActive);
            setSortOrder(data.sortOrder || '');
            setMenuIcon(data.menuIcon || '');
        } catch (error) {
            console.error("Error fetching menu data:", error);
        }
    };

    // Handle delete action
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this menu?")) return;
        
        setLoading(true);
        try {
            await axios.delete(`/api/menu/${selectedMenu}`);
            alert("Menu deleted successfully.");
            setSelectedMenu(''); 
            clearForm();
        } catch (error) {
            console.error("Error deleting menu:", error);
            alert("Failed to delete menu.");
        } finally {
            setLoading(false);
        }
    };

    // Handle submit for Add or Edit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const menuData = {
            moduleId,
            menuName,
            actionName: actionUrl,
            controllerName,
            isActive,
            sortOrder,
            menuIcon,
        };

        try {
            if (actionName === "Add Menu") {
                await axios.post("/api/menu", menuData); 
                alert("Menu added successfully.");
            } else {
                await axios.put(`/api/menu/${selectedMenu}`, menuData); 
                alert("Menu updated successfully.");
            }
        } catch (error) {
            console.error("Error submitting menu:", error);
            alert("Failed to submit menu.");
        } finally {
            setLoading(false);
        }
    };

    // Clear form fields
    const clearForm = () => {
        setModuleId('');
        setMenuName('');
        setActionUrl('');
        setControllerName('');
        setIsActive(true);
        setSortOrder('');
        setMenuIcon('');
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    useEffect(() => {
        if (actionName === "Edit Menu" && selectedMenu) {
            fetchMenuData(selectedMenu);
        }
    }, [actionName, selectedMenu]);

    return (
        <section className="flex flex-col items-center justify-center h-screen p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">{actionName || "Menu Management"}</h1>

            {/* Dropdown for menu selection */}
            {rights.editAllowed || rights.deleteAllowed ? (
                <div className="mb-4 w-full max-w-md">
                    <select
                        value={selectedMenu}
                        onChange={(e) => setSelectedMenu(e.target.value)}
                        className="border p-2 rounded w-full"
                    >
                        <option value="">Select a Menu</option>
                        {menuList?.map((menu) => (
                            <option key={menu.id} value={menu.id}>
                                {menu.menuName}
                            </option>
                        ))}
                    </select>
                </div>
            ) : null}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Module ID"
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="text"
                    placeholder="Menu Name"
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="text"
                    placeholder="Action URL"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="text"
                    placeholder="Controller Name"
                    value={controllerName}
                    onChange={(e) => setControllerName(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="text"
                    placeholder="Sort Order"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <input
                    type="text"
                    placeholder="Menu Icon"
                    value={menuIcon}
                    onChange={(e) => setMenuIcon(e.target.value)}
                    className="border p-2 rounded w-full"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                    />
                    Active
                </label>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                    disabled={loading || !selectedMenu}
                >
                    {actionName === "Add Menu" ? (loading ? "Adding..." : "Add") : (loading ? "Editing..." : "Edit")}
                </button>
            </form>

            {/* Delete button */}
            {rights.deleteAllowed && selectedMenu && (
                <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </button>
            )}
        </section>
    );
};

export default MenuManagementPage;
