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
      navigate("/");
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

  return (
    <>
      <Toaster />
      <div className="relative justify-center items-center h-screen flex px-11  bg-white">
        <div className="flex flex-grow gap-5">
          <div className="hidden p-10 h-screen flex-col w-[75%] lg:flex">
            <img
              loading="lazy"
              src={Frame}
              alt="Login illustration"
              className="object-contain h-full rounded-[49px]"
            />
          </div>
          <div className="lg:absolute lg:right-1/4 lg:top-1/4 lg:-mx-28 lg lg:-my-20 flex flex-col justify-center w-full max-w-md px-4 py-8 lg:w-1/3 lg:px-12 space-y-6 bg-white shadow-lg rounded-3xl">
            <div className="">
              <div className="mb-12 flex justify-center">
                <img src={Logo} alt="Medb Logo" className="h-10 w-auto" />
              </div>
              <h1 className="mb-2 text-2xl font-semibold text-gray-900 text-center">
                Welcome Back!
              </h1>
              <p className="text-sm text-gray-500 text-center">
                Please enter your details
              </p>
            </div>

            <form className="space-y-6">
              {/* Email Input */}
              <InputField
                type="email"
                placeholder="Email/Phone Number"
                icon={EmailLogo}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password Input */}
              <div className="relative">
                <InputField
                  type="password"
                  placeholder="Password"
                  icon={PasswordLogo}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Forgot Password */}
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

              {/* Login Button */}
              <Button
                onClick={handleSubmit}
                type="submit"
                className="h-12 w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              {/* Google Login Button */}
              <Button
                onClick={() => navigate("/googleLogin")}
                variant="outline"
                className="h-12 w-full hover:bg-gray-50 active:bg-gray-100"
              >
                <span className="flex items-center justify-center">
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                    alt="Google Logo"
                    className="w-8 aspect-square mr-2"
                  />
                  Login with Google
                </span>
              </Button>

              {/* Sign Up */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  type="button"
                  className="text-violet-600 hover:text-violet-700 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;