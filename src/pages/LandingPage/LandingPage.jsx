import React from 'react';
import Header from '../../components/Organs/Landing/Header';
import Hero from '../../components/Organs/Landing/Hero';
import FeatureSection from '../../components/Organs/Landing/Feature';
import AppointmentsScroll from '../../components/Organs/Landing/AppointmentsScroll';

const LandingPage = () => {
    return (
        <>
            <Header />
            <Hero />
            <FeatureSection />
            <AppointmentsScroll />
        </>
    );
}

export default LandingPage;