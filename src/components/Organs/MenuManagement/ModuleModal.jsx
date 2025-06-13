import { useState, useEffect } from "react";
import { addModule, editModule } from "../../../services/controlPanel";
import toast from "react-hot-toast";

const ModuleModal = ({ isOpen, closeModal, moduleData, onSubmit }) => {
    const [moduleName, setModuleName] = useState("");
    const [moduleIcon, setModuleIcon] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    useEffect(() => {
        if (moduleData) {
            setModuleName(moduleData.moduleName);
            setModuleIcon(moduleData.moduleIcon);
            setSortOrder(moduleData.sortOrder);
        }
    }, [moduleData, isOpen]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const data = {
            moduleId: moduleData?.moduleId || null,
            moduleName,
            moduleIcon,
            sortOrder: parseInt(sortOrder),
        };

        if (data && data.moduleName) {
            try {
                const moduleNameRegex = /^[A-Za-z][A-Za-z0-9\s]{1,49}$/;
                if (!moduleNameRegex.test(data.moduleName)) {
                    toast.error("Module name must start with a letter and be 2-50 characters long (letters, numbers, spaces).");
                    return;
                }

                if (data.moduleId) {
                    await editModule(data.moduleId, data);
                    toast.success("Module updated successfully");
                } else {
                    await addModule(data);
                    toast.success("Module added successfully");
                }

                onSubmit();
                setModuleName("");
                setModuleIcon("");
                setSortOrder("");
                closeModal();
            } catch (error) {
                toast.error(error.response.data.message || "Something went wrong. Please try again.");
            }
        } else {
            toast.error("Please fill out all required fields.");
        }
    };

    const handleCancel = () => {
        setModuleName("");
        setModuleIcon("");
        setSortOrder("");
        closeModal();
    };

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-md shadow-lg w-96" key={moduleData ? moduleData.moduleId : 'add-new'}>
                    <h3 className="text-xl font-semibold mb-4">
                        {moduleData ? "Edit Module" : "Add New Module"}
                    </h3>
                    <form onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label htmlFor="moduleName" className="block text-sm font-medium">
                                Module Name
                            </label>
                            <input
                                type="text"
                                id="moduleName"
                                value={moduleName}
                                onChange={(e) => setModuleName(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="moduleIcon" className="block text-sm font-medium">
                                Module Icon URL
                            </label>
                            <input
                                type="url"
                                id="moduleIcon"
                                value={moduleIcon}
                                onChange={(e) => setModuleIcon(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="sortOrder" className="block text-sm font-medium">
                                Sort Order
                            </label>
                            <input
                                type="number"
                                id="sortOrder"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-500 text-white rounded-md"
                            >
                                {moduleData ? "Update" : "Add Module"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default ModuleModal;
