import { Toaster } from "react-hot-toast";
import Header from "../../components/Organs/Landing/Header";
import FloatingActionButtons from "../../components/Organs/Landing/FloatingButtons";
import Footer from "../../components/Organs/Landing/Footer";
import ScrollToTop from "../../components/Atoms/ScrollToTop";
import DoctorRegistration from "../../components/Organs/Registration/DoctorRegistration";

const DoctorRegistrationPage = () => {


    return (
        <>
            <Toaster />
            <Header />
            <ScrollToTop />
            <FloatingActionButtons />
            <DoctorRegistration />
            <Footer />
        </>
    );
};

export default DoctorRegistrationPage;
