import { createContext, useContext, useState } from "react";
import SuccessPopup from "./SuccessPopup";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, duration = 3000) => {
        const id = Date.now();
        setToasts([...toasts, { id, message, duration }]);

        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
        }, duration);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed inset-0 flex items-start justify-center z-50">
                {toasts.map((toast) => (
                    <SuccessPopup key={toast.id} message={toast.message} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
