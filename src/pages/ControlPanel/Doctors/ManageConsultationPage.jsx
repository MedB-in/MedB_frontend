import LeaveManagement from "../../../components/Organs/Doctors/LeaveMangement";

const ManageConsultation = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const clinics = userDetails?.doctorClinics;
    const doctorId = userDetails?.doctorId;

    return (
        <LeaveManagement idDoctor={doctorId} clinics={clinics} />
    )
}

export default ManageConsultation