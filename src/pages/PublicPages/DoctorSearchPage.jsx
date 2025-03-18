import React, { Suspense, lazy } from 'react';

const Header = lazy(() => import('../../components/Organs/Landing/Header'));
const Hero = lazy(() => import('../../components/Organs/DoctorSearch/Hero'));
const SearchSection = lazy(() => import('../../components/Organs/DoctorSearch/Search'));
const Footer = lazy(() => import('../../components/Organs/Landing/Footer'));
const FloatingActionButtons = lazy(() => import('../../components/Organs/Landing/FloatingButtons'));


const LandingPage = () => {
    return (
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
            <Header />
            <FloatingActionButtons />
            <Hero />
            <SearchSection />
            <Footer />
        </Suspense>
    );
}

export default LandingPage;
