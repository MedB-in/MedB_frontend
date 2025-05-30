import { Toaster } from "react-hot-toast";
import Hero from "../../components/Organs/ForDoctor/Hero";
import FloatingActionButtons from '../../components/Organs/Landing/FloatingButtons';
import Header from "../../components/Organs/Landing/Header";
import Footer from "../../components/Organs/Landing/Footer";
import EasySteps from "../../components/Organs/ForDoctor/EasySteps";
import GetToKnow from "../../components/Organs/ForDoctor/GetToKnow";
import ScrollToTop from "../../components/Atoms/ScrollToTop";

const ForDoctorPage = () => {
    return (
        <>
            <Toaster />
            <Header />
            <ScrollToTop />
            <FloatingActionButtons />
            <Hero />
            <EasySteps />
            <GetToKnow />
            <Footer />
        </>
    );
}

export default ForDoctorPage