import React, { useEffect, useState } from "react";
import { getClinicUsers } from "../../../services/clinics";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ClinicUserModal from "../../../components/Organs/Clinics/ClinicUserModal";

function ClinicUsers() {
    const { clinicId } = useParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await getClinicUsers(clinicId);
                if (response?.data?.data) {
                    setUsers(response.data.data);
                } else {
                    setUsers([]);
                    toast.error("Invalid response from server");
                }
            } catch (error) {
                toast.error("Error fetching clinic users");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [clinicId]);

    const handleUserAdded = (newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
    };

    return (
        <div className="p-4">
            <button
                className="bg-gray-200 text-gray-700 px-4 py-2 my-5 rounded-md hover:bg-gray-300"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>
            <section className="flex flex-col items-center justify-center text-center bg-white">
                <button
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add User
                </button>


                <div className="w-full mx-auto bg-white shadow-md rounded-xl p-6">
                    <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="px-4 py-3 border border-gray-200">No.</th>
                                <th className="px-4 py-3 border border-gray-200">Name</th>
                                <th className="px-4 py-3 border border-gray-200">Email(Username)</th>
                                <th className="px-4 py-3 border border-gray-200">Contact</th>
                                <th className="px-4 py-3 border border-gray-200">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-3 border border-gray-200 text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {users.length > 0 ? (
                                        users.map((user, index) => (
                                            <tr key={index} className="odd:bg-white even:bg-gray-50">
                                                <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    {user.firstName} {user.middleName ? " " + user.middleName : ""} {user.lastName}
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">{user.email}</td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    {user.contactNo ? user.contactNo : "Not Provided"}
                                                </td>
                                                <td className="px-4 py-3 border border-gray-200">
                                                    <div className="flex flex-col">
                                                        <span>{user.isVerified ? "✅ Verified" : "❌ Not Verified"}</span>
                                                        <span>{user.isActive ? "🟢 Active" : "🔴 Inactive"}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-3 border border-gray-200 text-center">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {isModalOpen && (
                    <ClinicUserModal clinicId={clinicId} onClose={() => setIsModalOpen(false)} onUserAdded={handleUserAdded} />
                )}
            </section>
        </div>
    );
}

export default ClinicUsers;