import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DoctorIcon from "../../../assets/images/doctor-hero.png";
import ArrowRight from "../../../assets/images/arrow-right-02.png";
import LabIcon from "../../../assets/images/lab-hero.png";
import ClinicIcon from "../../../assets/images/clinic-hero.png";
import { getActiveClinics } from "../../../services/publicApi";
import toast from "react-hot-toast";

const Hero = () => {
    const tabs = ["Doctors", "Clinic", "Lab"];
    const images = { Doctors: DoctorIcon, Clinic: ClinicIcon, Lab: LabIcon };

    const [activeTab, setActiveTab] = useState("Doctors");
    const [clinicSearch, setClinicSearch] = useState("");
    const [clinicResults, setClinicResults] = useState([]);
    const [clinicId, setClinicId] = useState(null);
    const [isNoResults, setIsNoResults] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (clinicSearch.trim() && !clinicId) {
            const fetchClinics = async () => {
                try {
                    const response = await getActiveClinics(clinicSearch);
                    const clinics = response?.data?.clinics || [];
                    setClinicResults(clinics);
                    setIsNoResults(clinics.length === 0);
                } catch (error) {
                    toast.error(error.response?.data?.message || "Something went wrong.");
                    setIsNoResults(true);
                }
            };
            fetchClinics();
        } else {
            setClinicResults([]);
            setIsNoResults(false);
        }
    }, [clinicSearch]);

    const handleClinicSelect = (id, name) => {
        setClinicId(id);
        setClinicSearch(name);
        setClinicResults([]);
        setIsNoResults(false);
    };

    const handleInputChange = (e) => {
        setClinicSearch(e.target.value);
        setClinicId(null);
    };

    return (
        <section className="flex flex-col lg:flex-row items-center px-6 py-12 lg:px-16 bg-gradient-to-r from-white to-[#d9f1f2] mt-16 md:mt-20 cursor-default">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-[40px] lg:text-[80px] font-black text-[#6F64E7] leading-tight">
                    Do <span className="bold">MedB</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-gray-700 text-lg lg:w-[26vw]">
                    Effortlessly Schedule Doctor Appointments Without Waiting In Queues. Our User-Friendly App Ensures A Hassle-Free Experience, Putting You In Control Of Your Healthcare Journey.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="relative flex items-center bg-[#eef1ff] p-3 rounded-full mt-16 w-full max-w-md mx-auto lg:mx-0">
                    <input
                        type="text"
                        placeholder="Search for Clinics"
                        value={clinicSearch}
                        onChange={handleInputChange}
                        className="bg-transparent border-none outline-none flex-1 p-2 text-lg"
                    />
                    <motion.button whileHover={{ scale: 1.05 }} className="bg-white p-2 rounded-full shadow-md transition" disabled={!clinicId} onClick={() => navigate(`/find-doctor/?clinicId=${clinicId}`)}>
                        <img src={ArrowRight} alt="Arrow" className="w-6" />
                    </motion.button>
                    {clinicSearch.trim() && !clinicId && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md mt-2 max-h-64 overflow-y-auto z-10">
                            {isNoResults ? (
                                <div className="p-3 text-gray-500">No clinics found</div>
                            ) : (
                                clinicResults.map((clinic) => (
                                    <div key={clinic.clinicId} className="p-3 hover:bg-gray-100 cursor-pointer" onClick={() => handleClinicSelect(clinic.clinicid, clinic.name)}>
                                        {clinic.name}{clinic.address && `, ${clinic.address}`}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-center mt-6 lg:mt-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-6 w-full">
                    {tabs.map((tab) => (
                        <motion.button key={tab} whileTap={{ scale: 0.95 }} onClick={() => setActiveTab(tab)} className={`px-4 sm:px-6 py-2 rounded-full transition font-medium w-full sm:w-32 md:w-44 text-xs sm:text-sm md:text-base ${activeTab === tab ? "bg-[#573bff] text-white" : "bg-[#c7e4f2] text-gray-700"}`}> {tab} </motion.button>
                    ))}
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key={activeTab} className="p-4 sm:p-6 flex justify-center w-24 h-[250px] sm:w-32 sm:h-[300px] md:w-40 md:h-[400px]">
                    <motion.img initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} src={images[activeTab]} alt={activeTab} className="drop-shadow-lg w-full h-full object-contain" />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;