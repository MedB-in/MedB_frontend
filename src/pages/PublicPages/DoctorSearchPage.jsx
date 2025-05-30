import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getClinicDoctors } from '../../services/publicApi';
import Header from '../../components/Organs/Landing/Header';
import Footer from '../../components/Organs/Landing/Footer';
import FloatingActionButtons from '../../components/Organs/Landing/FloatingButtons';
import ClinicDetail from '../../components/Organs/Clinics/ClinicDetail';
import DoctorList from '../../components/Organs/Doctors/DoctorList';
import toast, { Toaster } from 'react-hot-toast';
import ScrollToTop from '../../components/Atoms/ScrollToTop';

const DoctorSearchPage = () => {
    const [clinicData, setClinicData] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const clinicId = new URLSearchParams(location.search).get('clinicId');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!clinicId) return;

        const fetchClinicData = async () => {
            try {
                const response = await getClinicDoctors(clinicId);
                setClinicData(response.data.clinic);
                setDoctors(response.data.doctors || []);
            } catch (error) {
                toast.error('Error fetching clinic data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClinicData();
    }, [clinicId]);

    return (
        <>
            <Toaster />
            <Header />
            <ScrollToTop />
            <FloatingActionButtons />
            <ClinicDetail clinicData={clinicData} loading={loading} />
            <DoctorList doctors={doctors} clinicId={clinicId} loading={loading} />
            <Footer />
        </>
    );
};

export default DoctorSearchPage;
