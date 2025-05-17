import { Toaster } from "react-hot-toast"
import Header from "../../components/Organs/Landing/Header"
import FloatingActionButtons from "../../components/Organs/Landing/FloatingButtons"
import Footer from "../../components/Organs/Landing/Footer"
import PrivacyPolicyMain from "../../components/Organs/Landing/PrivacyPolicyMain"
import ScrollToTop from "../../components/Atoms/ScrollToTop"

const PrivacyPolicyPage = () => {
    return (
        <>
        <Toaster />
        <Header />
        <ScrollToTop />
        <FloatingActionButtons />
        <PrivacyPolicyMain />
        <Footer />
    </>
    )
}

export default PrivacyPolicyPage