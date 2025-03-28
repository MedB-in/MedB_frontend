import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated, setUserDetails } from "../../redux/slices/authSlice";
import { setUserAccess } from "../../redux/slices/userAccessSlice";
import { doGoogleLogin, doLogin } from "../../services/auth";
import useToken from "../../hooks/useToken";
import Frame from "../../assets/images/frame.png";
import Logo from "../../assets/images/logo.svg";
import EmailIcon from "../../assets/images/email-icon.svg";
import PasswordIcon from "../../assets/images/password-icon.svg";
import InputField from "../../components/Atoms/Login/InputField";
import Button from "../../components/Atoms/Login/Button";
import ForgotPasswordIcon from "../../assets/images/forgotpassword-icon.svg";
import GoogleLoginButton from "../../components/Atoms/GoogleLogin/GoolgeLoginButton";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { authenticated } = useSelector((state) => state.auth);
  const { setToken } = useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;


  useEffect(() => {
    if (authenticated) {
      state?.from ? navigate(state.from) : navigate("/");
    }
  }, [authenticated, state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await doLogin({ email: email, password });
      setToken(data.accessToken);
      dispatch(setUserDetails(data.userDetails));
      dispatch(setUserAccess(data.menuData));
      dispatch(setAuthenticated(true));
      if (window.opener) {
        window.opener.postMessage('authenticated', window.location.origin);
        window.close();
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred on the server.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (googleUser) => {
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
      navigate("/");
    } catch (error) {
      toast.error("Google login failed. Try again.");
    }
  };

  return (
    <>
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative flex justify-center items-center h-screen px-11 bg-white">
        <div className="flex flex-grow gap-5">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex flex-col w-[75%] p-10 h-screen">
            <img
              loading="lazy"
              src={Frame}

              alt="Login illustration"
              className="object-cover h-full w-full rounded-[49px]"
            />
          </motion.div>
          <div
            className="flex flex-col justify-center w-full max-w-md :w-2/3 mx-auto px-4 py-8 space-y-6 border bg-white shadow-lg rounded-3xl lg:absolute lg:right-[10%] lg:top-1/2 lg:-translate-y-1/2 lg:w-1/3 lg:px-12">
            <div className="">
              <div className="mb-12 flex justify-center">
                <img src={Logo} onClick={() => navigate("/home")} alt="Medb Logo" className="h-10 mt-5 w-auto cursor-pointer" />
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-gray-900 text-center">
                Welcome Back!
              </h1>
              <p className="text-sm text-gray-500 text-center">
                Please enter your details
              </p>
            </div>
            <form className="space-y-6">
              <InputField
                type="email"
                placeholder="Email/Phone Number"
                icon={EmailIcon}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <InputField
                  type="password"
                  placeholder="Password"
                  icon={PasswordIcon}
                  value={password}
                  toggleable={true}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => navigate("/forgot-password")}
                  type="button"
                  className="flex gap-1.5 self-end text-indigo-500 text-opacity-60 text-sm"
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
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <GoogleLoginButton clientId={clientId} handleGoogleLogin={handleGoogleLogin} />
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  type="button"
                  className="text-violet-600 hover:text-violet-700 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>
      </motion.div >
    </>
  );
};

export default LoginPage;