import { useLocation } from 'react-router-dom';
import { getDoctor } from '../../services/publicApi';

import Header from '../../components/Organs/Landing/Header';
import Footer from '../../components/Organs/Landing/Footer';
import FloatingActionButtons from '../../components/Organs/Landing/FloatingButtons';
import DoctorProfile from '../../components/Organs/Doctors/DoctorProfile';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import ScrollToTop from '../../components/Atoms/ScrollToTop';

const DoctorProfilePage = () => {
    const location = useLocation();
    const [doctor, setDoctor] = useState(null);
    const [clinic, setClinic] = useState(null);
    const [loading, setLoading] = useState(true);

    const clinicId = new URLSearchParams(location.search).get('clinicId');
    const doctorId = new URLSearchParams(location.search).get('doctorId');

    useEffect(() => {
        if (!clinicId || !doctorId) return;

        const fetchDoctorData = async () => {
            try {
                const response = await getDoctor(clinicId, doctorId);
                setDoctor(response?.data?.data?.doctor);
                setClinic(response?.data?.data?.clinic);
            } catch (error) {
                toast.error('Error fetching doctor', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorData();
    }, [clinicId, doctorId]);

    return (
        <>
            <Toaster />
            <Header />
            <ScrollToTop />
            <FloatingActionButtons />
            <DoctorProfile doctor={doctor} clinic={clinic} clinicId={clinicId} doctorId={doctorId} loading={loading} />
            <Footer />
        </>
    );
};

export default DoctorProfilePage;
