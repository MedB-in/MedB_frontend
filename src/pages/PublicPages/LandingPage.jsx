import Header from '../../components/Organs/Landing/Header';
import Hero from '../../components/Organs/Landing/Hero';
import FeatureSection from '../../components/Organs/Landing/Feature';
import AppointmentsScroll from '../../components/Organs/Landing/AppointmentsScroll';
import MedicalCompanion from '../../components/Organs/Landing/MedicalCompanion';
import AboutUs from '../../components/Organs/Landing/AboutUs';
import Testimonials from '../../components/Organs/Landing/Testimonials';
import DoctorTestimonials from '../../components/Organs/Landing/DoctorTestimonials';
import Footer from '../../components/Organs/Landing/Footer';
import FloatingActionButtons from '../../components/Organs/Landing/FloatingButtons';
import { Toaster } from 'react-hot-toast';

const LandingPage = () => {
    return (
        <>
            <Toaster />
            <Header />
            <FloatingActionButtons />
            <Hero />
            <FeatureSection />
            <AppointmentsScroll />
            <MedicalCompanion />
            <AboutUs />
            <Testimonials />
            <DoctorTestimonials />
            <Footer />
        </>
    );
}

export default LandingPage;
