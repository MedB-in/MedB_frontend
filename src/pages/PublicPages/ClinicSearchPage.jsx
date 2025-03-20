import Header from '../../components/Organs/Landing/Header';
import Footer from '../../components/Organs/Landing/Footer';
import FloatingActionButtons from '../../components/Organs/Landing/FloatingButtons';
import Hero from '../../components/Organs/DoctorSearch/Hero';
import SearchSection from '../../components/Organs/DoctorSearch/Search';

const ClinicSearchPage = () => {
    return (
        <>
            <Header />
            <FloatingActionButtons />
            <Hero />
            <SearchSection />
            <Footer />
        </>
    );
}

export default ClinicSearchPage;