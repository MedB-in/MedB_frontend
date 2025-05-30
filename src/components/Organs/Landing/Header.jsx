import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import MedBLogo from "../../../assets/images/medb-logo-png.png";
import { useSelector } from "react-redux";

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const { authenticated } = useSelector(state => state.auth);

    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [menuOpen]);

    const navItems = [
        { name: "Home", path: "/" },
        {
            name: "For Healthcare",
            dropdown: true,
            items: [
                { name: "For Doctor", path: "/for-doctor" },
                { name: "For Clinic", path: "/for-clinic" },
            ]
        },
        { name: "Find Doctor/Clinic", path: "/find-doctor-clinic" },
    ];

    return (
        <header className="flex items-center justify-between p-4 lg:px-12 bg-transparent backdrop-blur fixed w-full top-0 z-50">
            <div className="h-[16px] lg:h-[42px] lg:w-[140px] flex items-center justify-start cursor-pointer" onClick={() => navigate("/")}>
                <img src={MedBLogo} alt="Logo" className="h-full object-contain max-w-[100%]" />
            </div>
            <button
                className="lg:hidden p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle Menu"
            >
                {menuOpen ? <X className="h-6 w-6 text-[#6F64E7]" /> : <Menu className="h-6 w-6 text-[#6F64E7]" />}
            </button>
            <nav className="hidden lg:flex items-center bg-[#6F64E7] px-6 py-3 rounded-lg ml-auto">
                <ul className="flex items-center gap-6">
                    {navItems.map((item) => (
                        <li key={item.name} className="relative group">
                            {item.dropdown ? (
                                <>
                                    <motion.div
                                        className="text-white font-medium px-3 py-2 cursor-pointer flex items-center gap-1"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {item.name}
                                        <svg
                                            className="w-4 h-4 mt-[2px]"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </motion.div>
                                    <div className="absolute top-full left-0 z-50 w-48 pt-2 hidden group-hover:block">
                                        <div className="bg-white rounded-md shadow-lg overflow-hidden">
                                            {item.items.map((subItem) => (
                                                <div
                                                    key={subItem.name}
                                                    onClick={() => navigate(subItem.path)}
                                                    className={`text-[#6F64E7] px-4 py-2 hover:bg-gray-100 cursor-pointer ${location.pathname === subItem.path ? "bg-gray-100 font-semibold" : ""}`}
                                                >
                                                    {subItem.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <motion.p
                                    onClick={() => navigate(item.path)}
                                    className={`text-white font-medium px-3 py-2 cursor-pointer ${location.pathname === item.path ? "underline underline-offset-8" : ""}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {item.name}
                                </motion.p>
                            )}
                        </li>
                    ))}
                    <motion.p
                        className={`text-white font-medium px-3 py-2 cursor-pointer`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => window.dispatchEvent(new Event("scroll-to-contact"))}
                    >
                        Contact Us
                    </motion.p>
                </ul>
            </nav>
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 w-full h-screen bg-black bg-opacity-50 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                        />
                        <motion.nav
                            className="fixed top-0 right-0 min-h-screen w-64 bg-white shadow-lg z-[60] flex flex-col p-6"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            <button
                                className="self-end p-2"
                                onClick={() => setMenuOpen(false)}
                                aria-label="Close Menu"
                            >
                                <X className="h-6 w-6 text-[#6F64E7]" />
                            </button>
                            <ul className="mt-6 space-y-4">
                                {navItems.map((item) => (
                                    <li key={item.name}>
                                        {item.dropdown ? (
                                            <div className="space-y-2">
                                                <p className="text-[#6F64E7] font-medium text-lg px-4 pt-2">For Healthcare</p>
                                                {item.items.map((subItem) => (
                                                    <motion.p
                                                        key={subItem.name}
                                                        onClick={() => {
                                                            navigate(subItem.path);
                                                            setMenuOpen(false);
                                                        }}
                                                        className={`block text-[#6F64E7] font-medium py-2 px-6 rounded-md cursor-pointer ${location.pathname === subItem.path ? "bg-gray-100" : ""}`}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {subItem.name}
                                                    </motion.p>
                                                ))}
                                            </div>
                                        ) : (
                                            <motion.p
                                                onClick={() => {
                                                    navigate(item.path);
                                                    setMenuOpen(false);
                                                }}
                                                className={`block text-[#6F64E7] font-medium py-2 px-4 rounded-md text-lg cursor-pointer ${location.pathname === item.path ? "bg-gray-100" : ""}`}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {item.name}
                                            </motion.p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <motion.button
                                className="mt-6 border border-[#6F64E7] text-[#573bff] px-6 py-3 rounded-md cursor-pointer transition hover:bg-[#6F64E7] hover:text-white w-full"
                                onClick={() => {
                                    navigate(authenticated ? "/app" : "/login");
                                    setMenuOpen(false);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {authenticated ? "Dashboard" : "Sign In"}
                            </motion.button>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
            <motion.button
                className="border border-[#6F64E7] text-[#573bff] px-6 py-3 rounded-md cursor-pointer ml-10 transition hover:bg-[#6F64E7] hover:text-white hidden lg:block"
                onClick={() => navigate(authenticated ? "/app" : "/login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {authenticated ? "Dashboard" : "Sign In"}
            </motion.button>
        </header>

    );
};

export default Header;
