import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { doGoogleLogin, doRegister, sendOtp, verifyOtp } from "../../services/auth";
import { motion } from "framer-motion";
import Logo from "../../assets/images/medb-logo-png.png";
import InputField from "../../components/Atoms/Login/InputField";
import Button from "../../components/Atoms/Login/Button";
import { useDispatch, useSelector } from "react-redux";
import GoogleLoginButton from "../../components/Atoms/GoogleLogin/GoolgeLoginButton";
import { isValidEmail, isValidName, isValidPhone } from "../../validation/validations";
import { setAuthenticated, setUserDetails } from "../../redux/slices/authSlice";
import { setUserAccess } from "../../redux/slices/userAccessSlice";
import clearStorage from "../../services/clearStorage";
import useToken from "../../hooks/useToken";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        contactNo: "",
        password: "",
        confirmPassword: "",
        code: ""
    });

    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [resendEnabled, setResendEnabled] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const otpRefs = useRef(Array(4).fill().map(() => React.createRef()));

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { authenticated } = useSelector((state) => state.auth);
    const { setToken } = useToken();

    useEffect(() => {
        if (authenticated) navigate("/");
    }, [authenticated]);

    useEffect(() => {
        if (otpTimer > 0) {
            const interval = setInterval(() => {
                setOtpTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setResendEnabled(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [otpTimer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "password" || name === "confirmPassword") {
                setPasswordMatch(updated.password === updated.confirmPassword);
            }
            return updated;
        });
    };

    const handleSendOtp = async () => {
        if (!isValidName(formData.firstName)) {
            return toast.error("Please enter a valid name");
        }
        if (formData.middleName && !isValidName(formData.middleName)) {
            return toast.error("Please enter a valid middle name");
        }
        if (formData.lastName && !isValidName(formData.lastName)) {
            return toast.error("Please enter a valid last name");
        }
        if (!email || !isValidEmail(email)) {
            return toast.error("Please enter a valid email address");
        }
        if (!formData.contactNo || !isValidPhone(formData.contactNo)) {
            return toast.error("Please enter a valid mobile number");
        }
        try {
            setOtpLoading(true);
            await sendOtp({ contactNo: formData.contactNo });
            toast.success("OTP sent successfully!");
            setFormData((prev) => ({ ...prev, code: "" }));
            setOtpTimer(30);
            setResendEnabled(false);
            setOtpModalOpen(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setOtpLoading(true);
            console.log(formData);

            await verifyOtp({ contactNo: formData.contactNo, code: formData.code });
            toast.success("Phone number verified!");
            setOtpVerified(true);
            setOtpModalOpen(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP.");
            setFormData((prev) => ({ ...prev, code: "" }));
        } finally {
            setOtpLoading(false);
        }
    };

    const handleOtpKeyDown = (e, index) => {
        const isBackspace = e.key === "Backspace";
        const isEnter = e.key === "Enter";

        if (isBackspace) {
            const newCode = formData.code.split("");
            newCode[index] = "";
            setFormData((prev) => ({ ...prev, code: newCode.join("") }));
            if (index > 0) otpRefs.current[index - 1].current?.focus();
        } else if (isEnter) {
            handleVerifyOtp();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, middleName, lastName, email, contactNo, password, confirmPassword } = formData;

        const setError = (msg) => {
            setFormError(msg);
            toast.error(msg);
            setTimeout(() => setFormError(""), 4000);
        };

        if (!firstName || !email || !contactNo || !password || !confirmPassword) return setError("All required fields must be filled.");
        if (!isValidName(firstName) || (middleName && !isValidName(middleName)) || (lastName && !isValidName(lastName))) return setError("Name fields must contain alphabets only or within 50 characters.");
        if (!isValidEmail(email)) return setError("Invalid email address.");
        if (!isValidPhone(contactNo)) return setError("Invalid contact number.");

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!?])[A-Za-z\d@#$%^&*!?]{8,}$/;
        if (!passwordRegex.test(password)) return setError("Password must include uppercase, lowercase, number, special char & be 8+ characters long.");
        if (password !== confirmPassword) return setError("Passwords do not match.");

        try {
            setLoading(true);
            const response = await doRegister(formData);
            toast.success(response.data.message);
            setRegistrationSuccess(true);
            setEmailSent(true);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async (googleUser) => {
        try {
            setGoogleLoading(true);
            clearStorage();
            const { data } = await doGoogleLogin({
                email: googleUser.email,
                googleId: googleUser.sub,
                name: googleUser.name,
                avatar: googleUser.picture
            });
            setToken(data.accessToken);
            dispatch(setUserDetails(data.userDetails));
            dispatch(setUserAccess(data.menuData));
            dispatch(setAuthenticated(true));
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Google login failed");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            {(googleLoading) && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-md flex justify-center items-center z-10"
                >
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-lg flex flex-col items-center font-extralight text-indigo-600"
                    >
                        <img src={Logo} alt="Medb Logo" className="h-10 mt-5 w-auto cursor-pointer" />
                        <span className="mt-2 animate-pulse">Logging in with Google...</span>
                    </motion.p>
                </motion.div>
            )}

            <div className="flex justify-center items-center min-h-screen bg-white px-4 py-8">
                <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12 space-y-6">
                    <div className="flex justify-center mb-4">
                        <img src={Logo} alt="Medb Logo" className="h-10 w-auto" />
                    </div>


                    <GoogleLoginButton
                        clientId={clientId}
                        handleGoogleLogin={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        register={true}
                    />
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mt-1">-Or-</p>
                    </div>
                    {!registrationSuccess && !emailSent && (
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-gray-900">Create an Account</h1>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {!registrationSuccess && !emailSent && (
                            <>
                                <InputField type="text" name="firstName" placeholder="First Name*" value={formData.firstName} onChange={handleChange} required />
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <InputField type="text" name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                                    <InputField type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                                </div>
                                <InputField type="email" name="email" placeholder="Email*" value={formData.email} onChange={handleChange} required />

                                <div className="relative">
                                    <InputField
                                        type="text"
                                        name="contactNo"
                                        placeholder="Contact Number*"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        required
                                        disabled={otpVerified}
                                    />
                                    {!otpVerified && (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={otpLoading}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-violet-600 hover:underline disabled:opacity-50"
                                        >
                                            {otpTimer > 0 ? `Wait ${otpTimer}s` : "Send OTP"}
                                        </button>
                                    )}
                                </div>

                                {otpVerified && (
                                    <>
                                        <InputField type="password" name="password" placeholder="Password*" value={formData.password} onChange={handleChange} toggleable required />
                                        <InputField type="password" name="confirmPassword" placeholder="Confirm Password*" value={formData.confirmPassword} onChange={handleChange} toggleable required />
                                    </>
                                )}

                                <div className="min-h-[1rem] text-sm text-red-500">
                                    {!passwordMatch && "Passwords do not match"}
                                </div>

                                <div className="min-h-[1rem] text-center text-sm">
                                    {formError ? (
                                        <p className="text-red-600">{formError}</p>
                                    ) : (
                                        <p className="invisible">placeholder</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800"
                                    disabled={loading}
                                >
                                    {loading ? "Registering..." : "Register"}
                                </Button>
                            </>
                        )}

                        {registrationSuccess && emailSent && (
                            <div className="text-center text-lg text-gray-600 mt-4">
                                <p className="text-green-700">
                                    Email verification has been sent to <strong>{formData.email}</strong>.<br />Please check your inbox.
                                </p>
                                <button
                                    onClick={() => navigate("/login")}
                                    type="button"
                                    className="text-violet-600 hover:text-violet-700 hover:underline mt-2"
                                >
                                    Go to Login
                                </button>
                            </div>
                        )}

                        {!registrationSuccess && !emailSent && (
                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <button
                                    onClick={() => navigate("/login")}
                                    type="button"
                                    className="text-violet-600 hover:text-violet-700 hover:underline"
                                >
                                    Login
                                </button>
                            </p>
                        )}
                    </form>
                </div>

                {otpModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4 text-center">Enter OTP</h2>
                            <div className="flex justify-center gap-3 mb-4">
                                {Array(4).fill('').map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength="1"
                                        ref={otpRefs.current[index]}
                                        className="w-12 h-12 text-2xl font-semibold text-center border border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
                                        value={formData.code[index] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/, '');
                                            const newCode = formData.code.split('');
                                            newCode[index] = val;
                                            const updatedCode = newCode.join('');
                                            setFormData((prev) => ({ ...prev, code: updatedCode }));

                                            if (val && index < 3) otpRefs.current[index + 1].current?.focus();
                                            if (updatedCode.length === 4 && !updatedCode.includes('')) {
                                                handleVerifyOtp();
                                            }
                                        }}
                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    />
                                ))}
                            </div>
                            <Button onClick={handleVerifyOtp} disabled={otpLoading}>
                                {otpLoading ? 'Verifying...' : 'Verify & Continue'}
                            </Button>
                            <button
                                onClick={() => {
                                    setOtpModalOpen(false);
                                    setFormData((prev) => ({ ...prev, code: "" }));
                                    setOtpTimer(0)
                                }}
                                className="text-sm text-red-600 mt-2 hover:underline block mx-auto"
                            >
                                Cancel
                            </button>
                            {resendEnabled && (
                                <button
                                    className="text-sm text-violet-600 hover:underline mt-2 block mx-auto"
                                    onClick={handleSendOtp}
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default RegisterPage;
