import { Toaster } from "react-hot-toast";
import Header from "../../components/Organs/Landing/Header";
import FloatingActionButtons from "../../components/Organs/Landing/FloatingButtons";
import Footer from "../../components/Organs/Landing/Footer";
import ScrollToTop from "../../components/Atoms/ScrollToTop";
import LabsComingSoon from "../../components/Organs/Landing/LabsComingSoon";

const ForLabsPage = () => {
    return (
        <>
            <Toaster />
            <ScrollToTop />
            <Header />
            <FloatingActionButtons />
            <LabsComingSoon />
        </>
    );
};

export default ForLabsPage;