import { Toaster } from "react-hot-toast";
import Header from "../../components/Organs/Landing/Header";
import FloatingActionButtons from "../../components/Organs/Landing/FloatingButtons";
import ClinicRegistration from "../../components/Organs/Registration/ClinicRegistration";
import Footer from "../../components/Organs/Landing/Footer";
import ScrollToTop from "../../components/Atoms/ScrollToTop";

const ClinicRegistrationPage = () => {


    return (
        <>
            <Toaster />
            <Header />
            <ScrollToTop />
            <FloatingActionButtons />
            <ClinicRegistration />
            <Footer />
        </>
    );
};

export default ClinicRegistrationPage;
