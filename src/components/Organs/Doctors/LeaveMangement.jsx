import React, { useEffect, useRef, useState } from 'react';
import { postDoctorLeave, getDoctorLeaveList, updateDoctorLeave, postConsultCancellation, editDoctorLeave } from '../../../services/doctors';
import { useParams } from 'react-router-dom';
import Calendar from '../../../components/Atoms/Calender';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getISTDate } from '../../../utils/time';

const LeaveManagement = ({ idDoctor, clinics }) => {
    const { doctorId, clinicId } = useParams();
    const useDoctorId = doctorId || idDoctor;
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(getISTDate());
    const [idClinic, setClinicId] = useState(() => {
        return JSON.parse(localStorage.getItem('selectedClinicId')) || null;
    });
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveList, setLeaveList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingLeaveId, setEditingLeaveId] = useState(null);
    const isPastLeave = selectedLeave && selectedLeave.leaveDate < getISTDate()
    const topRef = useRef(null);

    useEffect(() => {
        if (!clinics) {
            fetchDoctorLeaves();
        }
    }, [useDoctorId]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [useDoctorId]);

    useEffect(() => {
        if (clinics?.length && !idClinic) {
            const stored = JSON.parse(localStorage.getItem('selectedClinicId'));
            if (stored) setClinicId(stored);
        }
    }, [clinics]);

    useEffect(() => {
        const handleClinicChange = (e) => {
            const newClinicId = e.detail;
            setClinicId(newClinicId);
        };

        window.addEventListener('clinicIdChanged', handleClinicChange);

        return () => {
            window.removeEventListener('clinicIdChanged', handleClinicChange);
        };
    }, []);

    useEffect(() => {
        if (idClinic && useDoctorId) {
            fetchDoctorLeaves();
        }
    }, [idClinic, useDoctorId]);

    const handleEditLeave = (leave) => {
        return (e) => {
            e.stopPropagation();
            setSelectedDate(leave.leaveDate);
            setLeaveReason(leave.reason);
            setIsEditMode(true);
            setEditingLeaveId(leave.doctorLeaveId);
            if (topRef.current) {
                topRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        };
    };

    const handleUpdateLeave = async () => {
        if (!editingLeaveId || !selectedDate || !leaveReason) {
            toast.error("Please fill all fields before updating.");
            return;
        }
        try {
            setUpdating(true);
            await editDoctorLeave(editingLeaveId, {
                leaveDate: selectedDate,
                reason: leaveReason
            });
            toast.success("Leave updated successfully.");
            setIsEditMode(false);
            setEditingLeaveId(null);
            setSelectedDate(getISTDate());
            setLeaveReason('');
            fetchDoctorLeaves();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update leave");
        } finally {
            setUpdating(false);
        }
    };

    const fetchDoctorLeaves = async () => {
        try {
            setLoading(true);
            const response = await getDoctorLeaveList(useDoctorId, clinicId || idClinic);
            setDoctor(response?.data.doctor);
            setLeaveList(response?.data.leaveList || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDateSelect = ({ date }) => {
        setSelectedDate(date);
    };

    const formatDateWithTime = (dateString) => {
        const [datePart, timePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-');
        const [hourStr, minuteStr] = timePart.split(':');

        let hours = parseInt(hourStr, 10);
        const minutes = minuteStr;
        const period = hours < 12 ? 'AM' : 'PM';

        hours = hours % 12 || 12;

        return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const handleAddLeave = async () => {

        if (!idClinic) {
            toast.error('Please select a clinic.');
            return;
        }
        if (!selectedDate) {
            toast.error('Please select a date.');
            return;
        }
        if (!leaveReason || !selectedDate || !idClinic) {
            toast.error('Please enter a reason for the leave.');
            return;
        }

        try {
            setLoading(true);
            await postDoctorLeave(useDoctorId, clinicId || idClinic, { leaveDate: selectedDate, reason: leaveReason });
            fetchDoctorLeaves();
            setSelectedDate(getISTDate());
            setLeaveReason('');
            toast.success('Leave posted successfully.');
            setLeaveReason('');
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelConsultation = async (leave) => {
        if (!leaveReason) {
            toast.error('Please enter a reason for the cancellation.');
            return;
        }
        try {
            setUpdating(true);
            const result = await postConsultCancellation(useDoctorId, clinicId || idClinic, { leaveDate: selectedDate, reason: leaveReason });
            setLeaveList(prev => {
                const filtered = prev.filter(item => item.doctorLeaveId !== result.data.leave.doctorLeaveId);
                return [result.data.leave, ...filtered];
            });
            setSelectedDate(getISTDate());
            setLeaveReason('');
            toast.success('Leave posted successfully.');
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setUpdating(false);
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
            const result = await updateDoctorLeave(useDoctorId, clinicId || idClinic, leave, status);
            fetchDoctorLeaves();
            toast.success(`Leave ${status === 'approved' ? 'approved' : 'rejected'}`);
            setSelectedLeave(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div ref={topRef} className="min-h-screen p-6 pt-8">
            <div className=" mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
                {!clinics && (
                    <>
                        {loading && !doctor ? (
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
                {clinics && location.pathname.startsWith('/app/doctors') && (
                    <>
                        <h2 className="text-md md:text-2xl text-center font-bold text-gray-800">Leave Management </h2>
                        <h4 className="text-md text-center font-bold text-gray-800">Selected Clinic will be shown on the sidebar.  </h4>
                        <p className="text-gray-600 text-sm text-center">You can add your leave request here.</p>
                    </>
                )}
                {clinicId && location.pathname.startsWith('/app/clinics') && (
                    <>
                        <p className="text-gray-600 text-sm text-center">You can cancel <span className='font-bold capitalize'>{doctor?.firstName} {doctor?.middleName ? `${doctor?.middleName} ` : ''}{doctor?.lastName}{doctor?.firstName} {doctor?.middleName ? `${doctor?.middleName} ` : ''}{doctor?.lastName}'s</span> consultation here.</p>
                    </>
                )}
                <div className="flex flex-col items-center space-y-6 max-w-md mx-auto p-6">
                    <div className="w-full">
                        <Calendar onDateSelect={handleDateSelect} dateSelected={selectedDate} className="rounded-lg border border-gray-300" />
                    </div>

                    <div className="w-full">
                        <input
                            type="text"
                            placeholder={clinics && location.pathname.startsWith('/app/doctors') ? "Reason for leave" : "Reason for cancellation"}
                            className="w-full px-4 py-3 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                            value={leaveReason}
                            onChange={(e) => setLeaveReason(e.target.value)}
                        />
                    </div>
                    <div className="w-full">
                        {isEditMode ? (
                            <button
                                className="w-full px-6 py-3 mt-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none cursor-pointer"
                                onClick={handleUpdateLeave}
                                disabled={updating}
                            >
                                {updating ? 'Updating leave...' : 'Update Leave'}
                            </button>
                        ) : (
                            <button
                                className="w-full px-6 py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none cursor-pointer"
                                onClick={clinics && location.pathname.startsWith('/app/doctors') ? handleAddLeave : handleCancelConsultation}
                                disabled={updating}
                            >
                                {clinics && location.pathname.startsWith('/app/doctors')
                                    ? (updating ? 'Request in progress...' : 'Post Leave Request')
                                    : (updating ? 'Cancellation in progress...' : 'Cancel Consultation')}
                            </button>
                        )}
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mx-auto p-6">
                        <h3 className="text-xl font-semibold">📝 Existing Leave Requests</h3>
                        <p
                            className="text-gray-600 text-sm cursor-pointer font-bold underline hover:no-underline"
                            onClick={fetchDoctorLeaves}
                        >
                            {idClinic && 'Click to Refresh'}
                        </p>
                    </div>
                    {leaveList.length > 0 ? (
                        <ul className="space-y-3">
                            {leaveList
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

                                                {!leave.isApproved && !leave.isRejected && leave.leaveDate >= getISTDate() && (
                                                    <span className="text-yellow-500 text-xs font-medium">🕓 Pending</span>
                                                )}

                                                {!leave.isApproved && !leave.isRejected && leave.leaveDate < getISTDate() && (
                                                    <span className="text-gray-500 text-xs font-medium">⏳ Expired</span>
                                                )}
                                            </div>
                                            {clinics && !leave.isApproved && !leave.isRejected && leave.leaveDate >= getISTDate() && (
                                                <button
                                                    className="ml-4 text-blue-500 hover:text-blue-700"
                                                    onClick={handleEditLeave(leave)}
                                                >
                                                    Update leave request
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No leaves added yet.</p>
                    )}
                </div>
            </div>
            {selectedLeave && (
                < div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
                        <h4 className="text-xl font-semibold mb-2">
                            Leave on {selectedLeave.leaveDate}
                        </h4>
                        <p className="mb-4 text-gray-600">Reason: {selectedLeave.reason ? selectedLeave.reason : 'No reason provided'}</p>
                        <div className="flex justify-end gap-3">
                            {(!selectedLeave.isApproved || selectedLeave.isRejected) && !isPastLeave && (
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    onClick={() => handleApproveReject(selectedLeave.doctorLeaveId, 'approved')}
                                    disabled={updating}
                                >
                                    {updating ? 'Approving...' : 'Approve'}
                                </button>
                            )}
                            {(!selectedLeave.isRejected || selectedLeave.isApproved) && !isPastLeave && (
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