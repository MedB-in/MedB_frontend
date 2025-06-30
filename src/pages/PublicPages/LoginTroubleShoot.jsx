import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../../assets/images/medb-logo-png.png";
import InputField from "../../components/Atoms/Login/InputField";
import Button from "../../components/Atoms/Login/Button";
import { sendVerificationEmail } from "../../services/auth";

const LoginTroubleshoot = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerificationResend = async () => {
        if (!email) return toast.error("Please enter your registered email address.");

        setLoading(true);
        try {
            await sendVerificationEmail(email);
            toast.success("Verification email sent. Please check your inbox.");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send email. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-5 bg-white px-4">
            <Toaster />
            <div className="w-full max-w-md space-y-6 bg-white shadow-lg rounded-3xl p-8 sm:px-10">
                <div className="flex justify-center mb-4">
                    <img src={Logo} alt="Medb Logo" className="h-10" />
                </div>
                <h2 className="text-xl font-semibold text-center text-gray-800">Need Help Logging In?</h2>
                <p className="text-sm text-gray-600 text-center">
                    If you're facing issues with logging in or haven't received your verification email, use the options below.
                </p>

                <div className="space-y-4">
                    <Button
                        className="w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password
                    </Button>

                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-700 text-center mb-2">
                            Didn't receive the verification email?
                        </p>
                        <InputField
                            type="email"
                            name="email"
                            placeholder="Registered Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button
                            onClick={handleVerificationResend}
                            className="w-full bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Resend Verification Email"}
                        </Button>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200 text-sm text-gray-600">
                    <h3 className="font-semibold text-gray-800 mb-2">Login / Register Process</h3>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>After registering, a verification link will be sent to your email.</li>
                        <li>You must click the link to activate your account before logging in.</li>
                        <li>If you forget your password, use the "Forgot Password" option to reset it.</li>
                        <li>If you didn’t receive the verification email, you can request it again here.</li>
                    </ul>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                    <button onClick={() => navigate("/login")} className="text-violet-600 hover:text-violet-700 hover:underline">
                        Go to Login Page
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginTroubleshoot;
