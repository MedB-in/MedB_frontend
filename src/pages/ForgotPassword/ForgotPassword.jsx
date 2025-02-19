import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.svg";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import InputField from "../../components/Atoms/Login/InputField";
import Button from "../../components/Atoms/Login/Button";
import { getCodeForgotPass, resetPassword } from "../../services/auth";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { authenticated } = useSelector((state) => state.auth);
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState({ code: "", password: "", confirmPassword: "" });
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated, navigate]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await getCodeForgotPass(email);
            toast.success("Verification code sent to your email");
            setEmailSent(true);
        } catch (error) {
            toast.error("Failed to send code. Try again.");
        }
        setLoading(false);
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (formData.code.length !== 4) {
            toast.error("Please enter a valid code.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setPasswordMatch(false);
            return;
        }
        setPasswordMatch(true);
        setLoading(true);
        try {
            await resetPassword({ email, ...formData });
            toast.success("Password reset successful");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password. Try again.");
            setLoading(false);
        }
        setLoading(false);
    };


    return (
        <div>
            <Toaster />
            <div className="flex justify-center items-center h-screen px-4 bg-white">
                <div className="flex flex-col justify-center w-full max-w-md sm:w-4/5 sm:mx-auto md:w-2/3 md:mx-auto px-4 py-8 space-y-6 bg-white shadow-lg rounded-3xl lg:px-12">
                    <div className="mb-6 flex justify-center">
                        <img src={Logo} alt="Medb Logo" className="h-10 w-auto" />
                    </div>
                    {!emailSent ? (
                        <>
                            <h1 className="mb-2 text-2xl font-semibold text-gray-900 text-center">Forgot Password</h1>
                            <p className="text-sm text-gray-500 text-center">Enter your email to receive a reset code</p>
                            <form className="space-y-4" onSubmit={handleEmailSubmit}>
                                <InputField type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <Button type="submit" className="h-12 w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800" disabled={loading}>
                                    {loading ? "Sending..." : "Send Code"}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <h1 className="mb-2 text-2xl font-semibold text-gray-900 text-center">Reset Password</h1>
                            <p className="text-sm text-gray-500 text-center">Enter the code received on your email and your new password</p>
                            <form className="space-y-4" onSubmit={handleResetSubmit}>
                                <div className="flex justify-center gap-2">
                                    {Array(4)
                                        .fill("")
                                        .map((_, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                className="w-12 h-12 text-xl font-semibold text-center border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                                value={formData.code[index] || ""}
                                                onChange={(e) => {
                                                    let value = e.target.value.replace(/\D/, "");
                                                    if (value) {
                                                        let newCode = formData.code.split("");
                                                        newCode[index] = value;
                                                        setFormData({ ...formData, code: newCode.join("") });

                                                        if (index < 3) {
                                                            document.getElementById(`otp-${index + 1}`).focus();
                                                        }
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Backspace") {
                                                        let newCode = formData.code.split("");
                                                        newCode[index] = "";
                                                        setFormData({ ...formData, code: newCode.join("") });

                                                        if (index > 0) {
                                                            document.getElementById(`otp-${index - 1}`).focus();
                                                        }
                                                    }
                                                }}
                                                id={`otp-${index}`}
                                            />
                                        ))}
                                </div>
                                <InputField type="password" name="password" placeholder="New Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} toggleable required />
                                <InputField type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} toggleable required />
                                <div className="min-h-[1.5rem]">
                                    {!passwordMatch && <p className="text-red-500 text-sm">Passwords do not match</p>}
                                </div>
                                <Button type="submit" className="h-12 w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800" disabled={loading}>
                                    {loading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </>
                    )}
                    <p className="text-center text-sm text-gray-600">
                        Remembered your password? <button onClick={() => navigate("/login")} type="button" className="text-violet-600 hover:text-violet-700 hover:underline">Login</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
