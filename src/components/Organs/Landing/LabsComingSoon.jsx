import { motion } from "framer-motion";
import { Hourglass } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LabsComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br cursor-default from-[#e0f7fa] to-[#fce4ec] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-xl rounded-2xl max-w-lg w-full p-8 text-center border border-gray-100"
            >
                <div className="flex justify-center mb-6">
                    <Hourglass className="h-12 w-12 text-pink-500 animate-spin-slow" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Labs Feature Coming Soon</h1>
                <p className="text-gray-600 mb-6 text-sm">
                    We’re actively working on bringing you powerful lab integrations and diagnostics. This feature is currently under development.
                </p>
                <div className="text-gray-500 text-xs">Stay tuned for updates!</div>
                <div className="">Go <span onClick={() => navigate("/")} className="text-pink-500 cursor-pointer">Home</span></div>
            </motion.div>
        </div>
    );
};

export default LabsComingSoon;
