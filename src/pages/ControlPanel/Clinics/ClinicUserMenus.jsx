import { UserRightsPage } from "../Users";

const ClinicUserMenus = () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const clinicId = userDetails?.clinicId;

    return (
        <>
            <UserRightsPage clinicId={clinicId} />
        </>
    )
};

export default ClinicUserMenus