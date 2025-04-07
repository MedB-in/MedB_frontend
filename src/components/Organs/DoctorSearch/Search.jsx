import searchIcon from '../../../assets/images/search-icon.png';
import backgroundImage from '../../../assets/images/background-search.png';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getActiveDoctors, getActiveClinics } from '../../../services/publicApi';
import { useNavigate } from 'react-router-dom';

const SearchSection = () => {
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState(sessionStorage.getItem('searchType') || 'Doctor');
    const [searchQuery, setSearchQuery] = useState(sessionStorage.getItem('searchQuery') || '');
    const [results, setResults] = useState(JSON.parse(sessionStorage.getItem('results')) || []);
    const [isSearchDone, setIsSearchDone] = useState(sessionStorage.getItem('isSearchDone') === 'true');
    const [isLoading, setIsLoading] = useState(false);

    const searchResultsRef = useRef(null);

    useEffect(() => {
        sessionStorage.setItem('searchType', searchType);
        sessionStorage.setItem('searchQuery', searchQuery);
        sessionStorage.setItem('results', JSON.stringify(results));
        sessionStorage.setItem('isSearchDone', isSearchDone.toString());
    }, [searchType, searchQuery, results, isSearchDone]);

    const handleSearch = async () => {
        try {
            if (!searchQuery) {
                toast.error('Please enter a search term');
                return;
            }
            if (searchQuery.length < 3) {
                toast.error('Search term must be at least 3 characters long');
                return;
            }
            setIsLoading(true);
            setIsSearchDone(true);

            let response;
            if (searchType === 'Doctor') {
                response = await getActiveDoctors(searchQuery);
                setResults(response.data.doctors);
            } else {
                response = await getActiveClinics(searchQuery);
                setResults(response.data.clinics);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            toast.error('Error fetching search results');
        }
    };

    useEffect(() => {
        if (results.length > 0 && searchResultsRef.current) {
            setTimeout(() => {
                const offset = 120;
                const elementPosition = searchResultsRef.current.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
            }, 200);
        }
    }, [results]);

    const handleCardClick = (item) => {
        if (searchType === 'Doctor') {
            navigate(`/doctor-clinic/?doctorId=${item.doctorid}`);
        } else {
            navigate(`/find-doctor/?clinicId=${item.clinicid}`);
        }
    };

    return (
        <>
            {/* Desktop Search UI */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative hidden lg:flex flex-col items-center w-full py-5 mt-10 my-5 bg-no-repeat bg-center bg-contain"
                style={{ backgroundImage: `url(${backgroundImage})`, height: '200px' }}
            >
                <div className="flex justify-between mt-4 px-5 w-full md:w-1/3 relative z-10">
                    <input
                        type="text"
                        placeholder={`${searchType === 'Doctor' ? 'Search Doctors' : 'Enter Location/Clinic'}`}
                        className="flex-1 px-3 py-2 border w-1/2 border-white rounded-lg mr-3 box-border focus:outline-none bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <div className="relative flex-1">
                        <select
                            className="flex-1 px-3 py-2 border w-full border-white rounded-lg box-border focus:outline-none cursor-pointer bg-white text-black appearance-none"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="Doctor">Doctor</option>
                            <option value="Hospital/Clinic">Hospital/Clinic</option>
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            ▼
                        </div>
                    </div>
                </div>
                <button className="absolute bottom-5 h-12 left-1/2 transform -translate-x-1/2 bg-[#6F64E7] text-white px-6 py-2 rounded-full flex items-center justify-center shadow-md" onClick={handleSearch}>
                    {isLoading ? 'Searching...' : 'Search'}
                    <img src={searchIcon} alt="Search Icon" className="w-5 h-5 ml-2" />
                </button>
            </motion.div>
            {/* Mobile Search UI */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="p-1">
                <div className="flex lg:hidden flex-col items-center bg-[#6f64e75b] shadow-lg p-4 rounded-lg w-full">
                    <div className="flex flex-col w-full max-w-sm gap-3">
                        <input
                            type="text"
                            placeholder="Enter Location"
                            className="w-full px-3 py-2 border border-white rounded-lg focus:outline-none bg-white text-black"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <div className="relative">
                            <select className="w-full px-3 py-2 border border-white rounded-lg appearance-none bg-white focus:outline-none text-black"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}>
                                <option>Doctor</option>
                                <option>Hospital/Clinic</option>
                            </select>
                            <ArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div className="flex md:hidden flex-col items-center p-5 w-full">
                    <button className="mt-4 bg-[#6F64E7] text-white px-6 py-2 rounded-full flex items-center justify-center shadow-md w-full max-w-sm" onClick={handleSearch}>
                        {isLoading ? 'Searching...' : 'Search'}
                        <img src={searchIcon} alt="Search Icon" className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </motion.section>
            {/* Skeleton Loading */}
            {isLoading ? (
                <div className="px-8 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(6).fill(0).map((_, index) => (
                        <div key={index} className={`bg-gray-300 animate-pulse mt-10  ${searchType === 'Doctor' ? 'h-[320px]' : 'h-[260px]'} rounded-xl shadow-lg p-6 relative`}>
                            <div className="absolute w-24 h-24 rounded-full bg-gray-400 -top-12 left-1/2 transform -translate-x-1/2"></div>
                            <div className="mt-16 h-5 bg-gray-400 w-3/4 mx-auto rounded"></div>
                            <div className="mt-3 h-4 bg-gray-400 w-1/2 mx-auto rounded"></div>
                            <div className="mt-2 h-4 bg-gray-400 w-2/3 mx-auto rounded"></div>
                            <div className="mt-4 h-4 bg-gray-400 w-3/5 mx-auto rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    viewport={{ once: true, amount: 0.1 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="p-5"
                    ref={searchResultsRef}
                >
                    {results.length > 0 ? (
                        <div className="px-4 md:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {results.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCardClick(item)}
                                    className={`relative bg-[#c2b2f0] mt-12 p-3 ${searchType === 'Doctor' ? 'h-[320px]' : 'h-[260px]'} rounded-xl shadow-lg transition-transform transform hover:scale-105 text-center cursor-pointer border border-gray-200`}
                                >
                                    <img
                                        src={item.profilepicture || item.clinicpicture}
                                        alt={item.firstname || item.name}
                                        className="absolute w-24 h-24 object-cover rounded-full  -top-12 left-1/2 transform -translate-x-1/2 border-4 border-gray-200 shadow-xl"
                                    />
                                    <div className="mt-10">
                                        <h3 className="bg-white px-4 py-2 rounded-lg inline-block font-bold text-purple-900 capitalize">
                                            {item.firstname ? `Dr. ${item.firstname}` : item.name} {item.middlename || ''} {item.lastname || ''}
                                        </h3>

                                        {item.firstname ? (
                                            <div className="mt-3">
                                                {item.gender && <p className="text-sm text-black">Gender: {item.gender}</p>}
                                                {item.speciality && <p className="text-black capitalize text-lg font-medium">{item.speciality}</p>}
                                                {item.qualifications && <p className="text-black text-sm">{item.qualifications}</p>}
                                                {item.experience !== undefined && (
                                                    <p className="text-black text-sm">Experience: {item.experience} years</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-black capitalize mt-3 text-lg font-medium">{item.type || 'Clinic'}</p>
                                        )}

                                        <div className="mt-4 space-y-1">
                                            <p className="text-sm text-black">
                                                📍 {item.address || `${item.city}, ${item.district}, ${item.state}, ${item.country}`}
                                            </p>
                                            <p className="text-sm text-black">📧 {item.email}</p>
                                            <p className="text-sm text-black">📞 {item.phone || item.contact || 'Not Available'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        isSearchDone && <p className="text-center text-gray-500">No results found</p>
                    )}
                </motion.section>
            )}
        </>
    );
};

export default SearchSection;
