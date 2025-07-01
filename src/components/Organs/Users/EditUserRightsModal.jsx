import { useEffect, useState } from "react";
import { editUserRights } from "../../../services/user";
import { editClinicUserRights } from "../../../services/clinics";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const EditUserRightsModal = ({ clinicId, showModal, setShowModal, rights, setNewRights }) => {
    const [permissions, setPermissions] = useState({
        viewAllowed: false,
        editAllowed: false,
        createAllowed: false,
        deleteAllowed: false,
    });
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        const isAllUnchecked = Object.values(permissions).every((v) => v === false);

        if (isAllUnchecked) {
            const confirm = await Swal.fire({
                title: "No permissions selected",
                text: "This will remove all permissions for this user. Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, remove all",
            });

            if (!confirm.isConfirmed) {
                setLoading(false);
                return;
            }
        }

        try {
            const data = {
                userRightId: rights.userRightId,
                ...permissions,
            };
            if (clinicId) {
                await editClinicUserRights(data);
            } else {
                await editUserRights(data);
            }

            toast.success(
                isAllUnchecked
                    ? "All user rights removed"
                    : "User rights updated successfully"
            );

            setNewRights(isAllUnchecked ? null : permissions);
            setShowModal(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to update rights");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveRights = async () => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This will remove all permissions for this user.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove",
        });

        setLoading(true);
        if (confirm.isConfirmed) {
            try {
                const data = {
                    userRightId: rights.userRightId,
                    viewAllowed: false,
                    editAllowed: false,
                    createAllowed: false,
                    deleteAllowed: false,
                };
                if (clinicId) {
                    await editClinicUserRights(data);
                } else {
                    await editUserRights(data);
                }
                toast.success("User rights removed");
                setNewRights(null);
                setShowModal(false);
            } catch (error) {
                toast.error(error?.response?.data?.message || "Failed to remove rights");
            } finally {
                setLoading(false);
            }
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

                <div className="flex justify-between items-center pt-4">
                    <button
                        onClick={handleRemoveRights}
                        disabled={loading}
                        className="px-3 py-2 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200"
                    >
                        Remove Rights
                    </button>
                    <div className="space-x-2">
                        <button
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditUserRightsModal;
