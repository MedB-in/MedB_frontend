import { useEffect, useState } from "react";
import { getClinicsList } from "../../../services/user";
import { getMenu } from "../../../services/controlPanel";
import { getClinicMenus, addClinicUserRights } from "../../../services/clinics";
import { addUserRights } from "../../../services/user";
import Swal from "sweetalert2";

const UserRightsModal = ({ clinicId, showModal, setShowModal, user }) => {
    const [clinics, setClinics] = useState([]);
    const [menus, setMenus] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState("");
    const [selectedMenu, setSelectedMenu] = useState("");
    const [permissions, setPermissions] = useState({
        viewAllowed: false,
        editAllowed: false,
        createAllowed: false,
        deleteAllowed: false,
    });

    useEffect(() => {
        if (showModal && !clinicId) {
            fetchClinicAndMenu();
        }
    }, [showModal]);

    const fetchClinicAndMenu = async () => {
        try {
            const response = await getClinicsList(user?.userId);
            setClinics(response?.data.data || []);
            const response2 = await getMenu();
            setMenus(response2.data.menuData || []);
        } catch (error) {
            Swal.fire("Error", "Failed to fetch clinics and menus", "error");
        }
    };


    useEffect(() => {
        const fetchClinicMenu = async () => {
            if (!clinicId) return;
            try {
                const response = await getClinicMenus();
                setMenus(response.data.data || []);
            } catch (error) {
                toast.error(error?.response?.data?.message || "Something went wrong");
            }
        };

        fetchClinicMenu();
    }, [clinicId]);


    const handleSubmit = async () => {
        if (!selectedMenu) {
            return Swal.fire("Required", "Select both clinic and menu", "warning");
        }

        const hasAtLeastOnePermission = Object.values(permissions).some(val => val === true);

        if (!hasAtLeastOnePermission) {
            return Swal.fire("Permission Required", "Select at least one user right", "warning");
        }

        try {
            const data = {
                userId: user?.userId,
                clinicId: selectedClinic,
                menuId: selectedMenu,
                ...permissions,
            };

            await addUserRights(data);
            Swal.fire("Success", "User rights assigned successfully", "success");
            setPermissions({
                viewAllowed: false,
                editAllowed: false,
                createAllowed: false,
                deleteAllowed: false,
            })
            setSelectedClinic("");
            setSelectedMenu("");
            setShowModal(false);
        } catch (error) {
            Swal.fire("Error", error?.response?.data?.message || "Failed to assign rights", "error");
        }
    };

    const handleClinicSubmit = async () => {
        if (!selectedMenu) {
            return Swal.fire("Required", "Select menu", "warning");
        }

        const hasAtLeastOnePermission = Object.values(permissions).some(val => val === true);

        if (!hasAtLeastOnePermission) {
            return Swal.fire("Permission Required", "Select at least one user right", "warning");
        }

        try {
            const data = {
                userId: user?.userId,
                clinicId,
                menuId: selectedMenu,
                ...permissions,
            };

            await addClinicUserRights(data);
            Swal.fire("Success", "Menu assigned to user successfully", "success");
            setPermissions({
                viewAllowed: false,
                editAllowed: false,
                createAllowed: false,
                deleteAllowed: false,
            })
            setSelectedClinic("");
            setSelectedMenu("");
            setShowModal(false);
        } catch (error) {
            Swal.fire("Error", error?.response?.data?.message || "Failed to assign rights", "error");
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${showModal ? '' : 'hidden'}`}>
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">{clinicId ? "Add menu for clinic user" : "Assign User Rights"}</h2>
                {!clinicId && (
                    <>
                        <div>
                            <label className="block text-sm mb-1">Clinic</label>
                            <select
                                value={selectedClinic}
                                onChange={(e) => setSelectedClinic(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md"
                            >
                                <option value="">Select Clinic</option>
                                {clinics.map((clinic) => (
                                    <option key={clinic.clinicId} value={clinic.clinicId}>
                                        {clinic.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Menu</label>
                            <select
                                value={selectedMenu}
                                onChange={(e) => setSelectedMenu(e.target.value)}
                                className="w-full border px-3 py-2 rounded-md"
                            >
                                <option value="">Select Menu</option>
                                {menus.map((module) => (
                                    <optgroup key={module.moduleId} label={module.moduleName}>
                                        {module.menus?.map((menu) => (
                                            <option key={menu.menuId} value={menu.menuId}>
                                                {menu.menuName}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    </>
                )}
                {clinicId && (
                    <div>
                        <label className="block text-sm mb-1">Menu</label>
                        <select
                            value={selectedMenu}
                            onChange={(e) => setSelectedMenu(e.target.value)}
                            className="w-full border px-3 py-2 rounded-md"
                        >
                            <option value="">Select Menu</option>
                            {menus.map((menu) => (

                                <option key={menu.menuId} value={menu.menuId}>
                                    {menu.menuName}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
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
                        onClick={() => { setPermissions({ viewAllowed: false, editAllowed: false, createAllowed: false, deleteAllowed: false }), setSelectedClinic(""), setSelectedMenu(""), setShowModal(false) }}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={clinicId ? handleClinicSubmit : handleSubmit}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserRightsModal;
