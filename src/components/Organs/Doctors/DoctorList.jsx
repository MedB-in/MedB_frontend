import { useNavigate } from "react-router-dom";
import DoctorCard from "../../Atoms/Doctor/DoctorCard";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DoctorList = ({ doctors, loading, clinicId }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [filteredDoctors, setFilteredDoctors] = useState(doctors);
    const navigate = useNavigate();

    const uniqueDepartments = [...new Set(doctors.map((doctor) => doctor.speciality))];

    useEffect(() => {
        let results = doctors.filter((doctor) => {
            const fullName = `${doctor.firstName} ${doctor.middleName || ""} ${doctor.lastName}`.trim().toLowerCase();
            const normalizedFullName = fullName.replace(/^dr[.\s]+/i, "");
            const normalizedSearchTerm = searchTerm.toLowerCase().replace(/^dr[.\s]+/i, "");

            return normalizedFullName.includes(normalizedSearchTerm);
        });

        if (selectedDepartment) {
            results = results.filter((doctor) => doctor.speciality === selectedDepartment);
        }

        setFilteredDoctors(results);
    }, [searchTerm, selectedDepartment, doctors]);

    const onSelect = (doctor) => {
        navigate(`/doctor-profile/?clinicId=${clinicId}&doctorId=${doctor}`);
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
    };

    return (
        <div className="flex flex-col md:flex-wrap md:flex-row gap-6 justify-center items-stretch px-6 md:px-12 mb-10">
            <section className="w-full md:p-8 ">
                <div className="flex items-center w-full rounded-lg bg-[#6f64e454] p-8 md:px-16 shadow-md max-md:flex-col gap-6">
                    <div className="flex-1 w-full">
                        <select
                            className="w-full h-12 px-4 rounded-lg border border-gray-300 shadow-xl text-black capitalize"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            aria-label="Select Department"
                        >
                            <option value="">All Departments</option>
                            {uniqueDepartments.map((dept, index) => (
                                <option key={index} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 w-full">
                        <input
                            type="search"
                            placeholder="Search Doctors"
                            className="w-full h-12 px-4 rounded-lg shadow-xl text-black focus:outline-none focus:ring-0"
                            aria-label="Search Doctors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>
            {filteredDoctors?.map((doctor, index) => (
                <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <DoctorCard doctor={doctor} loading={loading} onSelect={onSelect} />
                </motion.div>
            ))}
        </div>
    );
};

export default DoctorList;
