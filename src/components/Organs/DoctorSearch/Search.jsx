import searchIcon from '../../../assets/images/search-icon.png';
import backgroundImage from '../../../assets/images/background-search.png';
import { motion } from "framer-motion";
import { ArrowDown } from 'lucide-react';

const SearchSection = () => {
    return (
        <>
            {/* Desktop Layout */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative hidden md:flex flex-col items-center w-full py-5 mt-10 my-5 bg-no-repeat bg-center bg-contain"
                style={{ backgroundImage: `url(${backgroundImage})`, height: '200px' }}
            >
                <div className="flex justify-between mt-4 px-5 w-full md:w-1/3 relative z-10">
                    <input
                        type="text"
                        placeholder="Locate yourself"
                        className="h-[6dvh] flex-1 px-3 py-2 border border-white rounded-lg mr-3 box-border focus:outline-none bg-white"
                    />

                    {/* Select Wrapper with Clickable Arrow */}
                    <div className="relative flex-1">
                        <select className="h-[6dvh] w-full px-3 py-2 border border-white rounded-lg appearance-none bg-white focus:outline-none text-black">
                            <option>Hospital/Clinic</option>
                        </select>
                        {/* Clickable Arrow Icon */}
                        <ArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                    </div>
                </div>

                <button className="absolute bottom-5 h-12 left-1/2 transform -translate-x-1/2 bg-[#6F64E7] text-white px-6 py-2 rounded-full flex items-center justify-center shadow-md">
                    Search...
                    <img src={searchIcon} alt="Search Icon" className="w-5 h-5 ml-2" />
                </button>
            </motion.div>


            {/* Mobile & Tablet Layout */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="px-5">
                <div className="flex md:hidden flex-col items-center bg-[#6F64E7] bg-opacity-20 p-12 rounded-lg w-full">
                    <div className="flex flex-col w-full max-w-sm gap-3">
                        <input
                            type="text"
                            placeholder="Locate yourself"
                            className="h-[6dvh] w-full px-3 py-2 border border-white rounded-lg focus:outline-none bg-white text-black"
                        />

                        {/* Select Wrapper with Clickable Arrow */}
                        <div className="relative">
                            <select className="h-[6dvh] w-full px-3 py-2 border border-white rounded-lg appearance-none bg-white focus:outline-none text-black">
                                <option>Hospital/Clinic</option>
                            </select>
                            {/* Clickable Arrow Icon */}
                            <ArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex md:hidden flex-col items-center p-5 w-full">
                    <button className="mt-4 bg-[#6F64E7] text-white px-6 py-2 rounded-full flex items-center justify-center shadow-md w-full max-w-sm">
                        Search...
                        <img src={searchIcon} alt="Search Icon" className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </motion.section>
        </>
    );
};

export default SearchSection;
