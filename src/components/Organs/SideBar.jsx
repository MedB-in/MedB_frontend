import io from 'socket.io-client';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarItem from '../Atoms/SideBar/SidebarItem';
import { setAuthenticated } from '../../redux/slices/authSlice';
import useAuth from '../../hooks/useAuth';
import Logo from '../../assets/images/medb-logo-2.svg';
import Logo1 from '../../assets/images/medb-logo-png.png';
import AlertIcon from '../../assets/images/alert-icon.png';
import LogoutIcon from '../../assets/images/logout-icon.png';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import Swal from 'sweetalert2';
import MobileNumberModal from './MobileNumber';
import { getNotifications, deleteNotification, deleteAllNotifications } from '../../services/notification';
import socket from '../../utils/socket';
import { reconnectSocketWithNewToken } from '../../utils/socket';
import toast from 'react-hot-toast';

const SideBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { authenticated, userDetails } = useSelector((state) => state.auth);
    const userAccess = useSelector((state) => state.userAccess.userAccess);
    const modules = userAccess || [];
    const notificationRef = useRef(null);
    const notificationRef2 = useRef(null);

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userDetails')));
    const [mobileModal, setMobileModal] = useState(() => {
        const storedValue = sessionStorage.getItem('mobileModal');
        return storedValue ? JSON.parse(storedValue) : true;
    });
    const [openModuleIndex, setOpenModuleIndex] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [newNotificationCount, setNewNotificationCount] = useState(0);

    const userId = user?.userId;

    useEffect(() => {
        if (authenticated && userId) {
            reconnectSocketWithNewToken();

            const handleNotification = (newNotification) => {
                setNotifications(prev => {
                    if (prev.some(n => n._id === newNotification._id)) return prev;
                    return [newNotification, ...prev];
                });
                setNewNotificationCount(prev => prev + 1);
            };


            socket.on('newNotification', handleNotification);

            return () => {
                socket.off('newNotification', handleNotification);
            };
        }
    }, [authenticated, userId]);

    if (userDetails) {
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current && !notificationRef.current.contains(event.target) &&
                notificationRef2.current && !notificationRef2.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleNotificationModal = () => {
        setNewNotificationCount(0);
        setShowNotifications(!showNotifications);
    };

    const updateUserDetails = () => {
        setUser(JSON.parse(localStorage.getItem('userDetails')) || {});
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            if (showNotifications) {
                try {
                    const response = await getNotifications();
                    setNotifications(response.data.data);
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            }
        };

        fetchNotifications();
    }, [showNotifications]);

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
        if (storedOpenModuleIndex !== null) {
            setOpenModuleIndex(Number(storedOpenModuleIndex));
        } else if (modules.length > 0) {
            setOpenModuleIndex(0);
        }
        if (storedSelectedMenu) {
            try {
                const parsedMenu = JSON.parse(storedSelectedMenu);
                const validMenu = modules
                    .flatMap(module => module.menus || [])
                    .find(menu => menu.menuId === parsedMenu.menuId);

                if (validMenu) {
                    setSelectedMenu(validMenu);
                }
            } catch (error) {
                console.error('Error parsing stored selectedMenu:', error);
            }
        }
    }, [modules]);

    useEffect(() => {
        if (openModuleIndex !== null) localStorage.setItem('openModuleIndex', openModuleIndex);
        if (selectedMenu) localStorage.setItem('selectedMenu', JSON.stringify(selectedMenu));
    }, [openModuleIndex, selectedMenu]);

    const toggleModule = (index) => {
        setOpenModuleIndex((prevIndex) => (prevIndex === index ? null : index));
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
        localStorage.setItem('selectedMenu', JSON.stringify(menu));
    };

    const doLogout = async () => {
        const result = await Swal.fire({
            title: "Logout",
            text: "Are you sure you want to logout?",
            showCancelButton: true,
            confirmButtonColor: "#6F64E7",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Confirm!",
        });
        if (!result.isConfirmed) return;
        dispatch(setAuthenticated(false));
        await logout();
        navigate('/');
    };

    const handleClearNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const handleClearAllNotifications = async () => {
        try {
            await deleteAllNotifications();
            setNotifications([]);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    const setMobileModalAction = () => {
        setMobileModal(false);
        sessionStorage.setItem('mobileModal', false);
    };

    return (
        <>
            <div className="lg:flex hidden">
                {user?.contactNo && mobileModal === true && (
                    <MobileNumberModal setMobileModal={setMobileModalAction} />
                )}
                <div className={`fixed z-30 h-[calc(100vh-32px)] m-4 ${isSidebarOpen ? "w-[270px]" : "w-[80px]"} bg-[#EAF4F4] transition-all duration-300 ease-in-out overflow-hidden rounded-3xl flex flex-col items-center`}>
                    <div className="flex justify-center items-center w-full py-6 cursor-pointer"
                        onClick={() => navigate("/home")}>
                        <img
                            src={isSidebarOpen ? Logo1 : Logo}
                            alt="Logo"
                            className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-32 opacity-100" : "w-16 opacity-80"}`}
                        />
                    </div>
                    <div className="py-6 w-full">
                        {modules?.length > 0 ? (
                            modules.map((module, moduleIndex) => (
                                <div key={moduleIndex} className="mb-2">
                                    <div
                                        onClick={() => toggleModule(moduleIndex)}
                                        className="cursor-pointer flex items-center gap-3 text-lg font-semibold mb-3 p-2 ml-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-300"
                                    >
                                        <img src={module.moduleIcon} alt={module.moduleName} className="w-6 h-6 transition-all duration-300 ease-in-out" />
                                        <span
                                            className={`transition-all duration-300 ease-in-out transform ${isSidebarOpen ? "opacity-100 translate-x-0 relative" : "hidden"}`}>
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
                                                        selectedMenu === menu.controllerName || location.pathname.startsWith(`/${menu.controllerName}`)

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
                    className={`header fixed top-0 z-50 h-16 px-4 py-3 flex justify-between items-center bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm transition-all ${isSidebarOpen ? "ml-[290px] w-[calc(100%-290px)]" : "ml-[100px] w-[calc(100%-100px)]"}`}
                >
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition-all duration-300 ease-in-out transform shadow-md"
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                    </button>
                    <div className="profile flex items-center">
                        <div className="relative">
                            <img
                                src={AlertIcon}
                                alt="Alert"
                                className="w-10 h-10 rounded-full object-cover mr-2 shadow-sm drop-shadow-md cursor-pointer"
                                onClick={handleNotificationModal}
                            />
                            {newNotificationCount > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {newNotificationCount > 9 ? '9+' : newNotificationCount}
                                </span>
                            )}
                            {showNotifications && (
                                <div
                                    ref={notificationRef}
                                    className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-200 z-50 overflow-hidden"
                                >
                                    <div className="flex justify-between items-center p-4 border-b font-semibold text-gray-700">
                                        <span>Notifications</span>

                                        {notifications.length > 0 && <button
                                            onClick={handleClearAllNotifications}
                                            className="text-sm text-red-500 hover:text-red-700"
                                        >
                                            Clear All
                                        </button>
                                        }
                                    </div>
                                    <ul className="max-h-60 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((n) => (
                                                <li key={n._id} className="px-4 py-2 hover:bg-gray-100 border-b flex justify-between items-center">
                                                    <div className={`${n.link ? 'cursor-pointer' : ''}`} {...n.link && { onClick: () => navigate(n.link) }} >
                                                        <div className="font-medium text-sm">{n.title}</div>
                                                        <div className="text-xs text-gray-500">{n.message}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleClearNotification(n._id)}
                                                        className="text-xs text-gray-400 hover:text-gray-600"
                                                    >
                                                        X
                                                    </button>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="p-4 my-5 text-center text-gray-500">No notifications</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <img
                            src={
                                user?.profilePicture ||
                                "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"
                            }
                            alt="Profile"
                            onClick={() => navigate("users/user-profile")}
                            className="w-10 h-10 mr-5 rounded-full object-cover border-2 border-gray-300 shadow-sm cursor-pointer"
                        />
                        <button className="logout flex items-center bg-transparent border-none" onClick={doLogout}>
                            <img src={LogoutIcon} alt="Logout" className="" />
                            <span className="ml-2 drop-shadow-md">Logout</span>
                        </button>
                    </div>
                </header>
            </div>

            {/* Sidebar for sm screens */}
            <div className="lg:hidden">
                {user?.contactNo && mobileModal === true && (
                    <MobileNumberModal setMobileModal={setMobileModalAction} />
                )}
                <header className="fixed w-screen z-40 h-16 px-6 py-3 bg-white bg-opacity-50 backdrop-filter backdrop-blur-sm shadow-md grid grid-cols-3 items-center">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 w-10 transition-all duration-300">
                        <Menu size={24} />
                    </button>
                    <div className="flex justify-center">
                        <img
                            src={isSidebarOpen ? Logo1 : Logo}
                            alt="Logo"
                            onClick={() => navigate("/home")}
                            className={`transition-all cursor-pointer duration-300 ease-in-out w-10 md:w-14 opacity-80`}
                        />
                    </div>
                    <div className="flex items-center justify-end gap-x-2 md:gap-x-4">
                        <img src={AlertIcon} alt="Alert" className="w-6 h-6 md:w-10 md:h-10 rounded-full object-cover shadow-sm cursor-pointer"
                            onClick={() => setShowNotifications(!showNotifications)} />
                        {showNotifications && (
                            <div
                                ref={notificationRef2}
                                className="absolute right-5 mt-64  w-80 bg-white shadow-lg rounded-xl border border-gray-200 z-50 overflow-hidden"
                            >
                                <div className="flex justify-between items-center p-4 border-b font-semibold text-gray-700">
                                    <span>Notifications</span>
                                    {notifications.length > 0 && <button
                                        onClick={handleClearAllNotifications}
                                        className="text-sm text-red-500 hover:text-red-700"
                                    >
                                        Clear All
                                    </button>
                                    }
                                </div>
                                <ul className="max-h-60 overflow-y-auto">
                                    {notifications.length > 0 ? (
                                        notifications.map((n) => (
                                            <li key={n._id} className="px-4 py-2 hover:bg-gray-100 border-b flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium text-sm">{n.title}</div>
                                                    <div className="text-xs text-gray-500">{n.message}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleClearNotification(n._id)}
                                                    className="text-xs text-gray-400 hover:text-gray-600"
                                                >
                                                    X
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-4 my-5 text-center text-gray-500">No notifications</li>
                                    )}
                                </ul>
                            </div>
                        )}
                        <img
                            src={user?.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"}
                            alt="Profile"
                            onClick={() => navigate("users/user-profile")}
                            className="w-6 h-6 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-300 shadow-sm cursor-pointer"
                        />
                        <button className="ml-2 flex items-center bg-transparent border-none" onClick={doLogout}>
                            <span className="drop-shadow-md">Logout</span>
                        </button>
                    </div>
                </header>

                <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${isSidebarOpen ? "block" : "hidden"}`} onClick={() => setIsSidebarOpen(false)}></div>
                <div className={`fixed top-0 left-0 h-full w-64 bg-[#EAF4F4] shadow-lg z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300`}>
                    <div className="flex justify-center items-center w-full py-6">
                        <img
                            src={Logo}
                            alt="Logo"
                            className="w-24 transition-all duration-300 ease-in-out cursor-pointer"
                            onClick={() => navigate("/home")}
                        />
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-3 absolute top-2 right-1 rounded-full">
                        <ChevronLeft size={24} />
                    </button>
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
                                                        selectedMenu === menu.controllerName || location.pathname.startsWith(`/${menu.controllerName}`)
                                                    }
                                                    onClick={() => { handleMenuClick(menu); setIsSidebarOpen(false) }}
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
            </div>
        </>
    );
};

export default SideBar;