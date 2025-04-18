import React, { useEffect, useState } from 'react';
import { postDoctorLeave, getDoctorLeaveList, updateDoctorLeave } from '../../../services/doctors';
import { useParams } from 'react-router-dom';
import Calendar from '../../../components/Atoms/Calender';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const LeaveManagement = ({ idDoctor, clinics }) => {
    const { doctorId, clinicId } = useParams();
    const useDoctorId = doctorId || idDoctor;
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [idClinic, setClinicId] = useState(clinicId);
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveList, setLeaveList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);

    useEffect(() => {
        if (!clinics) {
            fetchDoctorLeaves();
        }
    }, [useDoctorId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const fetchDoctorLeaves = async () => {
        try {
            const response = await getDoctorLeaveList(useDoctorId, idClinic);
            setDoctor(response?.data.doctor);
            setLeaveList(response?.data.leaveList || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleDateSelect = ({ date }) => {
        setSelectedDate(date);
    };

    const formatDateWithTime = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let hours = date.getHours();
        let minutes = String(date.getMinutes()).padStart(2, '0');
        const isAM = hours < 12;

        hours = hours % 12 || 12;
        const period = isAM ? 'AM' : 'PM';
        return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }


    const handleAddLeave = async () => {

        if (!leaveReason) {
            toast.error('Please enter a reason for the leave.');
            return;
        }

        try {
            setLoading(true);
            const response = await postDoctorLeave(useDoctorId, idClinic, { leaveDate: selectedDate, reason: leaveReason });
            setLeaveList((prev) => [...prev, response.data.leave]);
            toast.success('Leave posted successfully.');
            setLeaveReason('');
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveReject = async (leave, status) => {
        if (status === 'approved') {
            const confirmApproval = await Swal.fire({
                title: 'Are you sure?',
                text: "Approving this leave will cancel all the scheduled appointments for this doctor.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, approve leave',
                cancelButtonText: 'No, cancel'
            });

            if (!confirmApproval.isConfirmed) return;
        }

        if (status === 'rejected') {
            const confirmRejection = await Swal.fire({
                title: 'Are you sure?',
                text: "Are you sure you want to reject this leave request?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, reject leave',
                cancelButtonText: 'No, cancel'
            });

            if (!confirmRejection.isConfirmed) return;
        }

        try {
            setUpdating(true);
            const result = await updateDoctorLeave(useDoctorId, idClinic, leave, status);
            setLeaveList((prev) =>
                prev.map((l) => {
                    if (l.doctorLeaveId === leave) {
                        return {
                            ...l,
                            ...result.data.leave
                        };
                    }
                    return l;
                })
            );
            toast.success(`Leave ${status === 'approved' ? 'approved' : 'rejected'}`);
            setSelectedLeave(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setUpdating(false);
        }
    };

    const handleSelectClinic = (selectedClinicId) => {
        setClinicId(selectedClinicId);
    };
    useEffect(() => {
        if (idClinic && useDoctorId) {
            fetchDoctorLeaves();
        }
    }, [idClinic, useDoctorId]);



    return (
        <div className="min-h-screen p-6 pt-8">
            <div className=" mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
                {/* Doctor Details */}
                {!clinics && (
                    <>
                        {loading ? (
                            <div className="flex items-center gap-6 animate-pulse">
                                <div className="w-20 h-20 rounded-full bg-gray-300" />

                                <div className="space-y-2">
                                    <div className="h-6 w-60 bg-gray-300 rounded" />
                                    <div className="h-4 w-40 bg-gray-300 rounded" />
                                    <div className="h-4 w-24 bg-gray-300 rounded" />
                                    <div className="h-4 w-32 bg-gray-300 rounded" />
                                    <div className="h-4 w-48 bg-gray-300 rounded" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <img
                                    src={doctor?.profilePicture}
                                    alt={doctor?.firstName}
                                    className="w-20 h-20 rounded-full border-2 object-cover"
                                />
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">
                                        Dr. {doctor?.firstName} {doctor?.middleName ? `${doctor?.middleName} ` : ''}{doctor?.lastName || ''}
                                    </h2>
                                    <p className="text-gray-600 text-sm">{doctor?.email}</p>
                                    <p className="text-gray-600 text-sm">{doctor?.gender}</p>
                                    <p className="text-gray-500 capitalize">{doctor?.speciality}</p>
                                    <p className="text-gray-500 capitalize">{doctor?.qualifications}</p>
                                </div>
                            </div>
                        )
                        }
                    </>
                )}
                {clinics && (
                    <>
                        <h2 className="text-md md:text-2xl text-center font-bold text-gray-800">Leave Management</h2>
                        <p className="text-gray-600 text-sm text-center">You can add your leave request here.</p>
                        <span>Select a clinic:</span>
                        <select
                            className="w-full px-4 py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                            value={clinicId}
                            onChange={(e) => handleSelectClinic(e.target.value)}
                        >
                            <option value="">Select a clinic</option>
                            {clinics.map((clinic) => (
                                <option key={clinic.clinicId} value={clinic.clinicId}>
                                    {clinic.name}
                                </option>
                            ))}
                        </select>
                    </>
                )}
                {/* Calendar + Add Leave */}
                <div className="flex flex-col items-center space-y-6 max-w-md mx-auto p-6">
                    <div className="w-full">
                        <Calendar onDateSelect={handleDateSelect} className="rounded-lg border border-gray-300" />
                    </div>

                    <div className="w-full">
                        <input
                            type="text"
                            placeholder="Reason for leave"
                            className="w-full px-4 py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                            value={leaveReason}
                            onChange={(e) => setLeaveReason(e.target.value)}
                        />
                    </div>
                    <div className="w-full">
                        <button
                            className="w-full px-6 py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none"
                            onClick={handleAddLeave}
                            disabled={loading || !leaveReason.trim()}
                        >
                            {loading ? 'Request in progress...' : 'Post Leave Request'}
                        </button>
                    </div>
                </div>
                {/* Leave List */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">📝 Existing Leaves</h3>
                    {leaveList.length > 0 ? (
                        <ul className="space-y-3">
                            {leaveList
                                .sort((a, b) => new Date(a.leaveDate) - new Date(b.leaveDate))
                                .map((leave, index) => (
                                    <li
                                        key={index}
                                        className={`bg-gray-100 px-4 py-3 rounded-md text-gray-700 ${!clinics && 'cursor-pointer hover:bg-gray-200'}`}
                                        onClick={!clinics ? () => setSelectedLeave(leave) : undefined}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="font-medium text-sm">
                                                <div>Date of Leave: {formatDate(leave.leaveDate)}</div>
                                                <div>Requested on: {formatDateWithTime(leave.createdOn)}</div>
                                            </div>
                                            <div className="text-sm text-gray-500 max-w-xs ml-4">
                                                Reason: {leave.reason?.trim() || 'No reason provided'}
                                            </div>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                            <div className="flex space-x-2">
                                                {leave.isApproved && (
                                                    <span className="text-green-600 text-xs font-medium">✅ Approved</span>
                                                )}
                                                {leave.isRejected && (
                                                    <span className="text-red-500 text-xs font-medium">❌ Rejected</span>
                                                )}
                                                {!leave.isApproved && !leave.isRejected && (
                                                    <span className="text-yellow-500 text-xs font-medium">Pending</span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No leaves added yet.</p>
                    )}
                </div>
            </div>
            {/* Modal for Approve/Reject */}
            {
                selectedLeave && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
                            <h4 className="text-xl font-semibold mb-2">
                                Leave on {selectedLeave.leaveDate}
                            </h4>
                            <p className="mb-4 text-gray-600">Reason: {selectedLeave.reason ? selectedLeave.reason : 'No reason provided'}</p>
                            <div className="flex justify-end gap-3">
                                {(!selectedLeave.isApproved || selectedLeave.isRejected) && (
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        onClick={() => handleApproveReject(selectedLeave.doctorLeaveId, 'approved')}
                                        disabled={updating}
                                    >
                                        {updating ? 'Approving...' : 'Approve'}
                                    </button>
                                )}
                                {(!selectedLeave.isRejected || selectedLeave.isApproved) && (
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleApproveReject(selectedLeave.doctorLeaveId, 'rejected')}
                                        disabled={updating}
                                    >
                                        {updating ? 'Rejecting...' : 'Reject'}
                                    </button>
                                )}
                                <button
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                    onClick={() => setSelectedLeave(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                            {updating && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 rounded-xl z-10">
                                    <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>

                )
            }
        </div >
    );
};

export default LeaveManagement;