import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { verifyEmail } from "../../services/auth";
import Logo from "../../assets/images/medb-logo-png.png";
import Button from "../../components/Atoms/Login/Button";
import { useSelector } from "react-redux";

const VerifyEmailPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");
    const loginKey = queryParams.get("token");
    const [loading, setLoading] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(5);
    const [showRedirectLink, setShowRedirectLink] = useState(false);
    const navigate = useNavigate();

    const { authenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated, navigate]);

    const handleVerify = async () => {
        setLoading(true);
        try {
            await verifyEmail(loginKey, userId);
            setVerificationSuccess(true);
            toast.success("Email verified successfully!");
            setShowRedirectLink(true);

            let countdown = 5;
            const timer = setInterval(() => {
                countdown -= 1;
                setSecondsRemaining(countdown);

                if (countdown === 0) {
                    clearInterval(timer);
                    navigate("/login");
                }
            }, 1000);
        } catch (error) {
            toast.error("Email verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!userId || !loginKey) {
            toast.error("Invalid verification link.");
            navigate("/");
        }
    }, [userId, loginKey, navigate]);

    const handleRedirectToLogin = () => {
        navigate("/login");
    };

    return (
        <>
            <Toaster />
            <div className="flex justify-center items-center h-screen bg-white px-11">
                <div className="flex justify-center items-center w-full">
                    <div className="flex flex-col justify-center w-full max-w-md sm:w-4/5 md:w-2/3 mx-auto px-4 py-8 space-y-6 bg-white shadow-lg rounded-3xl lg:px-12">
                        <div className="mb-12 flex justify-center">
                            <img src={Logo} alt="Medb Logo" className="h-10 w-auto" />
                        </div>
                        {!verificationSuccess && (
                            <>
                                <h1 className="mb-2 text-2xl font-semibold text-gray-900 text-center">
                                    Email Verification
                                </h1>
                                <p className="text-sm text-gray-500 text-center">
                                    Please click the button below to verify your email address.
                                </p>
                            </>
                        )}
                        {verificationSuccess ? (
                            <>
                                <div className="text-center text-lg text-green-600">
                                    <p>Email verified successfully!</p>
                                </div>
                                <div className="text-center text-sm text-gray-600">
                                    <p>Redirecting you in {secondsRemaining} second{secondsRemaining > 1 ? 's' : ''}...</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-center">
                                <Button
                                    onClick={handleVerify}
                                    type="button"
                                    className="h-12 w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800"
                                    disabled={loading}
                                >
                                    {loading ? "Verifying..." : "Verify Email"}
                                </Button>
                            </div>
                        )}

                        {showRedirectLink && (
                            <div className="text-center">
                                <button
                                    onClick={handleRedirectToLogin}
                                    className="text-violet-600 hover:text-violet-700 hover:underline"
                                >
                                    Go to Login page now
                                </button>
                            </div>
                        )}

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                If you didn't request this,<br /> please ignore this email or contact support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyEmailPage;
