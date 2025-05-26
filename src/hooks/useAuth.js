import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { doLogout } from "../services/auth";
import { persistor } from "../redux/store";

function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const tokenString = localStorage.getItem('accessToken')

        if (tokenString) {
            const token = JSON.parse(tokenString);
            setUser(jwtDecode(token));
        } else {
            setUser(null);
        }
    }, []);

    const logout = async () => {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key && /[a-zA-Z]/.test(key)) {
                sessionStorage.removeItem(key);
                i--;
            }
        }
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && /[a-zA-Z]/.test(key)) {
                localStorage.removeItem(key);
                i--;
            }
        }
        sessionStorage.setItem('navStack', JSON.stringify([]));
        localStorage.clear();
        sessionStorage.clear();
        await persistor.purge();
        setUser(null);
        await doLogout().catch((error) => {
            console.log(error);
        });
    };

    const isAuthenticated = () => {
        return !!user;
    };

    return { user, logout, isAuthenticated };
}

export default useAuth;
