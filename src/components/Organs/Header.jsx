import React from 'react';
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

    const doLogout = async () => {
        const confirmation = confirm("Are you sure you want to logout?");
        if (!confirmation) return;
        dispatch(setAuthenticated(false));
        await logout();
        navigate("/");
    };

    return (
        <header className="fixed top-0 z-50 w-full px-4 py-5 flex border border-b-2 border-slate-200 bg-white ">
            <Toaster />
            <div className="flex flex-1 gap-6 items-center">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="Logo" width={80} />
                </div>
                <div className="h-5 w-[2px] bg-black" />
                <p>Control Panel</p>
            </div>
            {authenticated && (
                <button
                    onClick={doLogout}
                    className="border border-slate-200 bg-slate-300 p-2 font-medium rounded-md"
                >
                    Logout
                </button>
            )}
        </header>
    );
}

export default Header;
