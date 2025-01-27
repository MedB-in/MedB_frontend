import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { doLogout } from "../services/auth";

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
        localStorage.removeItem("accessToken");
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
