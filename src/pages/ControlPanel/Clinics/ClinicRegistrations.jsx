import React, { useState, useEffect, useMemo } from "react";
import { getClinicRegistrations, approveClinic, rejectClinic } from "../../../services/clinics";
import ClinicRow from "../../../components/Atoms/Clinic/ClinicRow";
import toast from "react-hot-toast";
import ClinicDetails from "../../../components/Atoms/Clinic/ClinicDetails";
import Swal from "sweetalert2";
import BackButton from "../../../components/Atoms/BackButton";

const ClinicRegistrations = () => {
    const [clinics, setClinics] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const { data } = await getClinicRegistrations(currentPage);
                setClinics(data.clinics);
                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong");
            }
        };

        fetchClinics();
    }, [currentPage]);

    const toggleDetails = (id) => {
        setSelectedId((prev) => (prev === id ? null : id));
    };

    const onApprove = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to approve this clinic registration?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Approve',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                const result = await approveClinic(id);
                setClinics((prevClinics) =>
                    prevClinics.map((clinic) =>
                        clinic.registrationId === id
                            ? {
                                ...clinic,
                                isApproved: result.data.isApproved,
                                isRejected: result.data.isRejected,
                                approvedBy: "Super Admin",
                                approvedOn: result.data.approvedOn,
                            }
                            : clinic
                    )
                );

                toast.success("Clinic approved successfully");
                setSelectedId(null);
            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
    };

    const onReject = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to reject this clinic registration?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Reject',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                setLoading(true);
                const result = await rejectClinic(id);

                setClinics((prevClinics) =>
                    prevClinics.map((clinic) =>
                        clinic.registrationId === id
                            ? {
                                ...clinic,
                                isApproved: result.data.isApproved,
                                isRejected: result.data.isRejected,
                                rejectedBy: "Super Admin",
                                rejectedOn: result.data.rejectedOn,
                                rejectedReason: result.data.rejectedReason,
                            }
                            : clinic
                    )
                );

                toast.success("Clinic rejected successfully");
                setSelectedId(null);
            } catch (error) {
                toast.error(error.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
    };

    const generatePagination = useMemo(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, "...", totalPages];
        } else if (currentPage >= totalPages - 3) {
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
        }
    }, [totalPages, currentPage]);

    return (
        <div className="bg-white px-6">
            <BackButton />
            <div className="mx-auto w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Clinic Registrations</h1>

                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white table-auto">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Clinic Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Contact</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">City</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clinics.map((clinic) => (
                                <React.Fragment key={clinic.registrationId}>
                                    <ClinicRow clinic={clinic} toggleDetails={toggleDetails} />
                                    {selectedId === clinic.registrationId && (
                                        <tr className="bg-gray-50">
                                            <td colSpan={5} className="p-4 border-t">
                                                <ClinicDetails
                                                    clinic={clinic}
                                                    onApprove={onApprove}
                                                    onReject={onReject}
                                                    onClose={() => setSelectedId(null)}
                                                    loading={loading}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center items-center space-x-2">
                        <button
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 disabled:opacity-50"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        {generatePagination.map((page, index) => (
                            <button
                                key={index}
                                className={`${page === "..." ? "text-gray-400 cursor-default"
                                    : page === currentPage
                                        ? "bg-gray-300 text-gray-800 font-bold"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"} px-4 py-2 rounded-lg`}
                                onClick={() => page !== "..." && setCurrentPage(page)}
                                disabled={page === "..."}>
                                {page}
                            </button>
                        ))}
                        <button
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition rounded-lg text-gray-700 disabled:opacity-50"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClinicRegistrations;
