import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SuccessPopup = ({ onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white rounded-xl shadow-lg p-6 w-80 text-center relative"
                    >
                        <div className="w-16 h-16 bg-white border-4 border-green-500 rounded-full flex items-center justify-center absolute -top-8 left-1/2 transform -translate-x-1/2">
                            ✅
                        </div>
                        <h1 className="text-2xl font-bold text-green-600 mt-6">Successful</h1>
                        <p className="text-gray-600 mt-2">Your action was completed successfully!</p>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessPopup;
