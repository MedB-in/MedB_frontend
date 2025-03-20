import { useLocation } from 'react-router-dom';
import Header from '../../components/Organs/Landing/Header';
import Footer from '../../components/Organs/Landing/Footer';
import FloatingActionButtons from '../../components/Organs/Landing/FloatingButtons';
import DoctorProfile from '../../components/Organs/Doctors/DoctorProfile';

const DoctorProfilePage = () => {
    const location = useLocation();
    const clinicId = new URLSearchParams(location.search).get('clinicId');
    const doctorId = new URLSearchParams(location.search).get('doctorId');
    return (
        < >
            <Header />
            <FloatingActionButtons />
            <DoctorProfile />
            <Footer />
        </>
    );
}

export default DoctorProfilePage;