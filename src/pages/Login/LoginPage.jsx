import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated, setUserDetails } from "../../redux/slices/authSlice";
import { setUserAccess } from "../../redux/slices/userAccessSlice";
import { doLogin } from "../../services/auth";
import useToken from "../../hooks/useToken";
import Frame from "../../assets/images/frame.png";
import Logo from "../../assets/images/logo.svg";
import EmailLogo from "../../assets/images/email-icon.svg";
import PasswordLogo from "../../assets/images/password-icon.svg";
import InputField from "../../components/Atoms/Login/InputField";
import Button from "../../components/Atoms/Button";
import ForgotPasswordIcon from "../../assets/images/forgotpassword-icon.svg";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    try {
      const { data } = await doLogin({ email: email, password });
      setToken(data.accessToken);
      dispatch(setUserDetails(data.userDetails));
      dispatch(setUserAccess(data.menuData));
      dispatch(setAuthenticated(true));
      navigate("/");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred on the server.");
      } else if (error.message) {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const handleSignUp = () => {
    navigate("/register");
  };

  const handleForgotPassword = () => {
    navigate("/forgotPassword");
  };

  return (
    <>
      <Toaster />
      <div className="relative h-screen flex px-11 py-5 bg-white">
        <div className="flex flex-grow gap-5">
          {/* Left Section: Illustration */}
          <div className="flex h-screen flex-col w-[62%]">
            <img
              loading="lazy"
              src={Frame}
              alt="Login illustration"
              className="object-contain h-full rounded-[49px]"
            />
          </div>
          {/* Right Section: Form */}
          <div className="absolute top-[20%] right-[18%] flex flex-col w-[30%] justify-center">
            <img
              loading="lazy"
              src={Logo}
              alt="Company logo"
              className="self-center object-contain w-[154px] mb-5"
            />
            <form className="flex flex-col items-center bg-white rounded-3xl border border-indigo-500 border-solid p-5">
              <div className="w-full text-center mb-5">
                <h1 className="text-2xl font-semibold text-black">Welcome Back! MedB</h1>
                <p className="text-base text-black text-opacity-50 mt-2">
                  Please enter your details
                </p>
              </div>
              <div className="w-full mb-5">
                <InputField
                  id="email"
                  type="email"
                  placeholder="Email/Phone Number"
                  icon={EmailLogo}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  ariaLabel="Email/Phone Number"
                />
              </div>
              <div className="w-full mb-5">
                <InputField
                  id="password"
                  type="password"
                  placeholder="Password"
                  icon={PasswordLogo}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  toggleable={true}
                  ariaLabel="Password"
                />
              </div>
              <button
                onClick={handleSignUp}
                type="button"
                className="flex gap-1.5 self-end text-indigo-500 text-opacity-60 text-sm"
              >
                <img
                  loading="lazy"
                  src={ForgotPasswordIcon}
                  alt=""
                  className="w-4 aspect-square"
                />
                Forgot Password
              </button>
              <Button onClick={handleSubmit} variant="primary" type="submit" className="mt-5 w-full">
                Login
              </Button>
              <Button variant="secondary" className="mt-2 w-full">
                Login with Google
              </Button>
              <div className="flex gap-1 mt-5 text-sm">
                <p className="text-black text-opacity-70">Don't have an account?</p>
                <button
                  onClick={handleForgotPassword}
                  type="button"
                  className="text-indigo-500"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
