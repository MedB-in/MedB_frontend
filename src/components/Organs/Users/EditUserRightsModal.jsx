import { useEffect, useState } from "react";
import { editUserRights } from "../../../services/user";
import toast from "react-hot-toast";

const EditUserRightsModal = ({ showModal, setShowModal, rights, setNewRights }) => {
    const [permissions, setPermissions] = useState({
        viewAllowed: false,
        editAllowed: false,
        createAllowed: false,
        deleteAllowed: false,
    });

    useEffect(() => {
        if (showModal && rights?.userId) {
            setPermissions({
                viewAllowed: rights.viewAllowed,
                editAllowed: rights.editAllowed,
                createAllowed: rights.createAllowed,
                deleteAllowed: rights.deleteAllowed,
            });
        }
    }, [showModal, rights]);

    const handleSubmit = async () => {
        try {
            const data = {
                userRightId: rights.userRightId,
                ...permissions,
            };
            await editUserRights(data);
            toast.success("User rights updated successfully");
            setNewRights(permissions)
            setShowModal(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update rights");
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${showModal ? '' : 'hidden'}`}>
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Edit User Rights</h2>

                <div className="grid grid-cols-2 gap-3">
                    {["view", "edit", "create", "delete"].map((perm) => (
                        <label key={perm} className="inline-flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={permissions[`${perm}Allowed`]}
                                onChange={(e) =>
                                    setPermissions((prev) => ({
                                        ...prev,
                                        [`${perm}Allowed`]: e.target.checked,
                                    }))
                                }
                            />
                            <span className="capitalize">{perm}</span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUserRightsModal;
