import ClinicDetailsPage from "./ClinicDetailsPage"

const ClinicProfile = () => {

    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const clinicId = userDetails?.clinicId;
    return (
        <ClinicDetailsPage idClinic={clinicId} />
    );
}

export default ClinicProfile;;