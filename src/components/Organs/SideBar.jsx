import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../Atoms/SideBar/SidebarItem';
import { setAuthenticated } from '../../redux/slices/authSlice';
import useAuth from '../../hooks/useAuth';
import Logo from '../../assets/images/medb-logo-2.svg';
import Logo1 from '../../assets/images/medb-logo-png.png';
import AlertIcon from '../../assets/images/alert-icon.png';
import LogoutIcon from '../../assets/images/logout-icon.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { authenticated, userDetails } = useSelector((state) => state.auth);
    const userAccess = useSelector((state) => state.userAccess.userAccess);
    const modules = userAccess || [];

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userDetails')));
    const [openModuleIndex, setOpenModuleIndex] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);

    if (userDetails) {
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
    }

    const updateUserDetails = () => {
        setUser(JSON.parse(localStorage.getItem('userDetails')) || {});
    };

    useEffect(() => {
        window.addEventListener('storage', updateUserDetails);
        window.addEventListener('userDetailsUpdated', updateUserDetails);
        return () => {
            window.removeEventListener('storage', updateUserDetails);
            window.removeEventListener('userDetailsUpdated', updateUserDetails);
        };
    }, []);

    useEffect(() => {
        updateUserDetails();
    }, [authenticated]);

    useEffect(() => {
        const storedOpenModuleIndex = localStorage.getItem('openModuleIndex');
        const storedSelectedMenu = localStorage.getItem('selectedMenu');
        if (storedOpenModuleIndex !== null) setOpenModuleIndex(Number(storedOpenModuleIndex));
        if (storedSelectedMenu) setSelectedMenu(storedSelectedMenu);
    }, []);

    useEffect(() => {
        if (openModuleIndex !== null) localStorage.setItem('openModuleIndex', openModuleIndex);
        if (selectedMenu) localStorage.setItem('selectedMenu', selectedMenu);
    }, [openModuleIndex, selectedMenu]);

    const toggleModule = (index) => {
        setOpenModuleIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu.actionUrl);
    };

    const doLogout = async () => {
        const confirmation = confirm('Are you sure you want to logout?');
        if (!confirmation) return;
        dispatch(setAuthenticated(false));
        await logout();
        navigate('/');
    };

    return (
        <div className="flex">
            <div className={`fixed z-50 h-[calc(100vh-32px)] m-4 ${isSidebarOpen ? "w-[270px]" : "w-[80px]"} bg-[#EAF4F4] transition-all duration-300 ease-in-out overflow-hidden rounded-3xl flex flex-col items-center`}>
                <div className="flex justify-center items-center w-full py-6 cursor-pointer"
                    onClick={() => navigate("/home")}>
                    <img
                        src={isSidebarOpen ? Logo1 : Logo}
                        alt="Logo"
                        className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-32 opacity-100" : "w-16 opacity-80"}`}
                    />
                </div>
                <div className="py-6 w-full">
                    {modules.length > 0 ? (
                        modules.map((module, moduleIndex) => (
                            <div key={moduleIndex} className="mb-2">
                                <div
                                    onClick={() => toggleModule(moduleIndex)}
                                    className="cursor-pointer flex items-center gap-3 text-lg font-semibold mb-3 p-2 ml-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-300"
                                >
                                    <img src={module.moduleIcon} alt={module.moduleName} className="w-6 h-6 transition-all duration-300 ease-in-out" />
                                    <span
                                        className={`transition-all duration-300 ease-in-out delay-150 transform ${isSidebarOpen ? "opacity-100 translate-x-0 relative" : "opacity-0 -translate-x-2 absolute"
                                            }`}
                                    >
                                        {module.moduleName}
                                    </span>
                                </div>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openModuleIndex === moduleIndex ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                                >
                                    <div className="pl-4">
                                        {module.menus.map((menu, menuIndex) => (
                                            <SidebarItem
                                                key={menuIndex}
                                                icon={menu.menuIcon}
                                                label={menu.menuName}
                                                actionUrl={menu.controllerName}
                                                isSidebarOpen={isSidebarOpen}
                                                isSelected={
                                                    selectedMenu === menu.controllerName || location.pathname.split("/")[1] === menu.controllerName
                                                }
                                                onClick={() => handleMenuClick(menu)}
                                                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ease-in-out 1
                                                ${selectedMenu === menu.controllerName ? "bg-gray-200 font-semibold text-black shadow-md" : "hover:bg-gray-200 text-gray-600"}
                                            `}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm text-center transition-all duration-300 ease-in-out">
                            No modules available
                        </div>
                    )}
                </div>
            </div>
            <header
                className={`header fixed top-0 right-0 z-50 h-16 px-4 py-3 flex justify-between items-center bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm transition-all ${isSidebarOpen ? "ml-[290px] w-[calc(100%-290px)]" : "ml-[100px] w-[calc(100%-100px)]"}`}
            >
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all duration-300 ease-in-out transform shadow-md"
                >
                    {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
                <div className="profile flex items-center">
                    <img src={AlertIcon} alt="Alert" className="w-10 h-10 rounded-full object-cover mr-2 shadow-sm drop-shadow-md" />
                    <img
                        src={
                            user?.profilePicture ||
                            "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                        }
                        alt="Profile"
                        className="w-10 h-10 mr-5 rounded-full object-cover border-2 border-gray-300 shadow-sm"
                    />
                    <button className="logout flex items-center bg-transparent border-none" onClick={doLogout}>
                        <img src={LogoutIcon} alt="Logout" className="" />
                        <span className="ml-2 drop-shadow-md">Logout</span>
                    </button>
                </div>
            </header>
        </div>
    );
};

export default SideBar;