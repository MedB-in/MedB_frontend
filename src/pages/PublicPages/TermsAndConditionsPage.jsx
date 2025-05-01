import { Toaster } from "react-hot-toast";
import FloatingActionButtons from "../../components/Organs/Landing/FloatingButtons";
import Footer from "../../components/Organs/Landing/Footer";
import Header from "../../components/Organs/Landing/Header";
import TermsAndConditions from "../../components/Organs/Landing/TermsAndConditions";

const TermsAndConditionsPage = () => {
    return (
        <>
            <Toaster />
            <Header />
            <FloatingActionButtons />
            <TermsAndConditions />
            <Footer />
        </>
    );
}

export default TermsAndConditionsPage