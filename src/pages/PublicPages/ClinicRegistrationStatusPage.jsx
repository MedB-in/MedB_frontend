import { Toaster } from "react-hot-toast";
import Header from "../../components/Organs/Landing/Header";
import FloatingActionButtons from "../../components/Organs/Landing/FloatingButtons";
import Footer from "../../components/Organs/Landing/Footer";
import ClinicRegistrationStatus from "../../components/Organs/Registration/ClinicRegistrationStatus";
import ScrollToTop from "../../components/Atoms/ScrollToTop";

const ClinicRegistrationStatusPage = () => {
    return (
        <>
            <Toaster />
            <Header />
            <ScrollToTop />
            <FloatingActionButtons />
            <ClinicRegistrationStatus />
            <Footer />
        </>
    );
};

export default ClinicRegistrationStatusPage;
