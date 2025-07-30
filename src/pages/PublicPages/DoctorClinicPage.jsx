import Header from '../../components/Organs/Landing/Header';
import Footer from '../../components/Organs/Landing/Footer';
import FloatingActionButtons from '../../components/Organs/Landing/FloatingButtons';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DoctorDetails from '../../components/Organs/Doctors/DoctorDetails';
import { getDoctorClinics } from '../../services/publicApi';
import ClinicCard from '../../components/Organs/Clinics/ClinicCard';
import ScrollToTop from '../../components/Atoms/ScrollToTop';

const DoctorClinicPage = () => {
    const location = useLocation();
    const [doctor, setDoctor] = useState(null);
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const doctorId = new URLSearchParams(location.search).get('doctorId');

    useEffect(() => {
        const fetchDoctorClinics = async () => {
            try {
                const response = await getDoctorClinics(doctorId);
                if (response) {
                    setDoctor(response.data.doctor);
                    setClinics(response.data.clinics);
                }
            } catch (error) {
                toast.error('Error fetching doctor and clinic details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (doctorId) {
            fetchDoctorClinics();
        }
    }, [doctorId]);

    const handleClinicClick = (clinicId) => {
        navigate(`/doctor-profile/?clinicId=${clinicId}&doctorId=${doctorId}`);
    };

    return (
        <>
            <Toaster />
            <Header />
            <ScrollToTop />
            <FloatingActionButtons />
            <>
                <DoctorDetails doctor={doctor} />
                {clinics.length > 0 ? (
                    <div className="px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
                        {clinics.map((clinics, index) => (
                            <ClinicCard key={clinics.clinicId || index} clinics={clinics} onClinicClick={handleClinicClick} />
                        ))}
                    </div>
                ) : (!loading &&
                    <p className="text-center text-gray-500">No clinics available for this doctor.</p>
                )}
            </>
            <Footer />
        </>
    );
}

export default DoctorClinicPage;