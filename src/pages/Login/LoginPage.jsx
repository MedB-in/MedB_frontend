import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import EmailIcon from "../../assets/images/email-icon.svg";
import ForgotPasswordIcon from "../../assets/images/forgotpassword-icon.svg";
import Frame from "../../assets/images/frame.png";
import Logo from "../../assets/images/medb-logo-png.png";
import PasswordIcon from "../../assets/images/password-icon.svg";
import GoogleLoginButton from "../../components/Atoms/GoogleLogin/GoolgeLoginButton";
import Button from "../../components/Atoms/Login/Button";
import InputField from "../../components/Atoms/Login/InputField";
import useToken from "../../hooks/useToken";
import { setAuthenticated, setUserDetails } from "../../redux/slices/authSlice";
import { setUserAccess } from "../../redux/slices/userAccessSlice";
import { doGoogleLogin, doLogin } from "../../services/auth";
import { otpLogin } from "../../services/auth";
import clearStorage from "../../services/clearStorage";
import { isValidOtp, isValidPhone } from "../../validation/validations";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendEnabled, setResendEnabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { authenticated } = useSelector((state) => state.auth);
  const { setToken } = useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (authenticated) {
      state?.from ? navigate(state.from) : navigate("/app");
    }
  }, [authenticated, state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearStorage();
    try {
      if (!email && !isOtpLogin) {
        toast.error("Please enter your email.");
        return;
      }
      if (!password && !isOtpLogin) {
        toast.error("Please enter your password.");
        return;
      }
      if (isOtpLogin && !otp) {
        toast.error("Please enter your OTP.");
        return;
      }
      if (!isValidOtp(otp) && isOtpLogin) {
        toast.error("Please enter a valid OTP.");
        return;
      }
      const { data } = await doLogin({ email: email, password, otp, mobileNumber });
      dispatch(setUserAccess(null));
      dispatch(setUserDetails(null));
      setToken(data.accessToken);
      dispatch(setUserDetails(data.userDetails));
      dispatch(setUserAccess(data.menuData));
      dispatch(setAuthenticated(true));
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "authenticated",
            payload: {
              userDetails: data.userDetails,
              menuData: data.menuData,
            },
          },
          window.location.origin
        );
        window.close();
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!mobileNumber) return toast.error("Enter mobile number");
    if (!isValidPhone(mobileNumber)) return toast.error("Enter valid mobile number");
    try {
      setLoadingOTP(true);
      await otpLogin(mobileNumber);
      toast.success("OTP sent!");
      setOtpSent(true);
      setResendEnabled(false);
      setTimer(30);

      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            setResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoadingOTP(false);
    }
  }

  const handleGoogleLogin = async (googleUser) => {
    setGoogleLoading(true);
    clearStorage();
    try {
      const { data } = await doGoogleLogin({
        email: googleUser.email,
        googleId: googleUser.sub,
        name: googleUser.name,
        avatar: googleUser.picture,
      });
      setToken(data.accessToken);
      dispatch(setUserDetails(data.userDetails));
      dispatch(setUserAccess(data.menuData));
      dispatch(setAuthenticated(true));
      if (window.opener) {
        window.opener.postMessage(
          {
            type: "authenticated",
            payload: {
              userDetails: data.userDetails,
              menuData: data.menuData,
            },
          },
          window.location.origin
        );
        window.close();
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };
  const handleSwitch = () => {
    setIsOtpLogin(!isOtpLogin);
    setOtpSent(false);
    setMobileNumber("");
    setOtp("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <Toaster />
      {(loading || googleLoading) && (
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
            <img
              src={Logo}
              alt="Medb Logo"
              className="h-10 mt-5 w-auto cursor-pointer"
            />
            <span className="mt-2 animate-pulse">
              {googleLoading ? "Logging in with Google..." : "Logging in..."}
            </span>
          </motion.p>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex justify-center items-center h-screen px-11 bg-white"
      >
        <div className="flex flex-grow gap-5">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col w-[75%] p-10 h-screen"
          >
            <img
              loading="lazy"
              src={Frame}
              alt="Login illustration"
              className="object-cover h-full w-full rounded-[49px]"
            />
          </motion.div>

          <div className="flex flex-col justify-center w-full max-w-md mx-auto px-4 py-8 space-y-6 border bg-white shadow-lg rounded-3xl lg:absolute lg:right-[10%] lg:top-1/2 lg:-translate-y-1/2 lg:w-1/3 lg:px-12">
            <div className="">
              <div className="mb-12 flex justify-center">
                <img
                  src={Logo}
                  onClick={() => navigate("/")}
                  alt="Medb Logo"
                  className="h-10 mt-5 w-auto cursor-pointer"
                />
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-gray-900 text-center">
                Welcome Back!
              </h1>
            </div>
            <form className="space-y-6">
              {isOtpLogin ? (
                <>
                  <InputField
                    type="tel"
                    placeholder="Mobile Number"
                    icon={PasswordIcon}
                    value={mobileNumber}
                    disabled={otpSent}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />

                  {!otpSent ? (
                    <Button
                      onClick={handleSendOTP}
                      disabled={!mobileNumber || loadingOTP}
                      className="h-12 w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800"
                    >
                      {loadingOTP ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  ) : (
                    <>
                      <InputField
                        type="text"
                        placeholder="Enter OTP"
                        icon={PasswordIcon}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />

                      <div className="flex justify-between items-center mt-2">
                        {!resendEnabled ? (
                          <p className="text-sm text-gray-500">
                            Resend OTP in <span className="font-medium">{timer}s</span>
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            className="text-sm text-violet-600 hover:underline"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>

                      <Button
                        onClick={handleSubmit}
                        className="h-12 w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800 mt-2"
                      >
                        {loading ? "Verifying OTP..." : "Login with OTP"}
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <InputField
                    type="email"
                    placeholder="Email"
                    icon={EmailIcon}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputField
                    type="password"
                    placeholder="Password"
                    icon={PasswordIcon}
                    value={password}
                    toggleable={true}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <div className="flex justify-end -mt-3">
                    <button
                      onClick={() => navigate("/forgot-password")}
                      type="button"
                      className="flex gap-1.5 text-indigo-500 text-opacity-60 text-sm"
                    >
                      <img
                        src={ForgotPasswordIcon}
                        alt="Forgot Password"
                        className="w-4 aspect-square"
                      />
                      Forgot Password
                    </button>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    type="submit"
                    className="h-12 w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800"
                    disabled={loading || googleLoading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </>
              )}
              <div className="text-center text-sm font-extrabold text-gray-600 space-y-1">
                <p className="text-gray-400 text-sm font-semibold mb-4">— Or —</p>
                <button
                  type="button"
                  onClick={handleSwitch}
                  className="mt-6 w-full max-w-[418px] min-h-[48px] text-sm font-medium text-indigo-500 text-opacity-70 border border-indigo-500 rounded-full hover:text-violet-700 transition-all duration-200 cursor-pointer">
                  {isOtpLogin ? "Email login?" : "OTP login?"}{" "}Click here
                </button>
              </div>
              <GoogleLoginButton
                clientId={clientId}
                handleGoogleLogin={handleGoogleLogin}
                disabled={loading || googleLoading}
              />
              <div className="text-center text-sm text-gray-600 space-y-2 pt-1">
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/register")}
                    type="button"
                    className="text-violet-600 hover:text-violet-700 hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
                <p className="text-xs">
                  Trouble logging in?{" "}
                  <button
                    onClick={() => navigate("/login-troubleshooting")}
                    type="button"
                    className="text-violet-600 hover:text-violet-700 hover:underline"
                  >
                    Click Here
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default LoginPage;
