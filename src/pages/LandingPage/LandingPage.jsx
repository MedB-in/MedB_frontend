import React, { Suspense, lazy } from 'react';

const Header = lazy(() => import('../../components/Organs/Landing/Header'));
const Hero = lazy(() => import('../../components/Organs/Landing/Hero'));
const FeatureSection = lazy(() => import('../../components/Organs/Landing/Feature'));
const AppointmentsScroll = lazy(() => import('../../components/Organs/Landing/AppointmentsScroll'));
const MedicalCompanion = lazy(() => import('../../components/Organs/Landing/MedicalCompanion'));
const AboutUs = lazy(() => import('../../components/Organs/Landing/AboutUs'));
const Testimonials = lazy(() => import('../../components/Organs/Landing/Testimonials'));
const DoctorTestimonials = lazy(() => import('../../components/Organs/Landing/DoctorTestimonials'));
const Footer = lazy(() => import('../../components/Organs/Landing/Footer'));
const FloatingActionButtons = lazy(() => import('../../components/Organs/Landing/FloatingButtons'));


const LandingPage = () => {
    return (
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
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
        </Suspense>
    );
}

export default LandingPage;
