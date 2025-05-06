import { Toaster } from "react-hot-toast";
import Header from "../../components/Organs/Landing/Header";
import FloatingActionButtons from "../../components/Organs/Landing/FloatingButtons";
import Footer from "../../components/Organs/Landing/Footer";
import AboutUsMain from "../../components/Organs/Landing/AboutUsMain";
import ScrollToTop from "../../components/Atoms/ScrollToTop";

const AboutUsPage = () => {
    return (
        <>
            <Toaster />
            <ScrollToTop />
            <Header />
            <FloatingActionButtons />
            <AboutUsMain />
            <Footer />
        </>
    );
};

export default AboutUsPage;