import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthenticated } from '../../redux/slices/authSlice';
import useAuth from '../../hooks/useAuth';
import Logo from '../../assets/images/medb-logo-2.svg';

const Header = () => {
    const { logout } = useAuth();
    const { authenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userDetails')) || {});

    const updateUserDetails = () => {
        setUser(JSON.parse(localStorage.getItem('userDetails')) || {});
    };

    useEffect(() => {
        window.addEventListener("storage", updateUserDetails);
        window.addEventListener("userDetailsUpdated", updateUserDetails);

        return () => {
            window.removeEventListener("storage", updateUserDetails);
            window.removeEventListener("userDetailsUpdated", updateUserDetails);
        };
    }, []);

    useEffect(() => {
        updateUserDetails();
    }, [authenticated]);

    const doLogout = async () => {
        const confirmation = confirm("Are you sure you want to logout?");
        if (!confirmation) return;
        dispatch(setAuthenticated(false));
        await logout();
        navigate("/");
    };

    return (
        <header className="fixed top-0 z-50 w-full px-4 py-3 flex justify-between border border-b-2 border-slate-200 bg-white bg-opacity-50 backdrop-filter backdrop-blur-md">
            <Toaster />
            <div className="flex items-center gap-4">
                <img src={Logo} alt="Logo" width={80} />
            </div>
            <div className="flex items-center gap-4 ml-auto">
                <div className="text-right">
                    <p className="text-lg font-bold">
                        {user?.firstName} {user?.middleName} {user?.lastName}
                    </p>
                    {authenticated && (
                        <p className="text-md text-red-500 hover:text-red-900 cursor-pointer" onClick={doLogout}>
                            Logout
                        </p>
                    )}
                </div>
                <img
                    src={user?.profilePicture || "https://static.vecteezy.com/system/resources/thumbnails/028/149/256/small_2x/3d-user-profile-icon-png.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover ml-4"
                />
            </div>
        </header>
    );
}

export default Header;
