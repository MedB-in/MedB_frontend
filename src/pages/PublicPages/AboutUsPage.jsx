import { Toaster } from "react-hot-toast";
import Header from "../../components/Organs/Landing/Header";
import FloatingActionButtons from "../../components/Organs/Landing/FloatingButtons";
import Footer from "../../components/Organs/Landing/Footer";
import AboutUsMain from "../../components/Organs/Landing/AboutUsMain";

const AboutUsPage = () => {
    return (
        <>
            <Toaster />
            <Header />
            <FloatingActionButtons />
            <AboutUsMain />
            <Footer />
        </>
    );
};

export default AboutUsPage;