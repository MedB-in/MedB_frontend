import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { doRegister } from "../../services/auth";
import Logo from "../../assets/images/medb-logo-png.png";
import InputField from "../../components/Atoms/Login/InputField";
import Button from "../../components/Atoms/Login/Button";
import { useSelector } from "react-redux";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        contactNo: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();
    const { authenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (authenticated) {
            navigate("/");
        }
    }, [authenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => {
            const updatedData = { ...prevData, [name]: value };

            if (name === "password" || name === "confirmPassword") {
                setPasswordMatch(updatedData.password === updatedData.confirmPassword);
            }

            return updatedData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!passwordMatch) {
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            if (!formData.firstName || !formData.email || !formData.password || !formData.confirmPassword) {
                toast.error("All fields are required.");
                return;
            }
            const response = await doRegister(formData);
            toast.success(response.data.message);
            setRegistrationSuccess(true);
            setEmailSent(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            <div className="flex justify-center items-center h-screen px-4 bg-white">
                <div className="flex flex-col justify-center w-full max-w-md sm:w-4/5 sm:mx-auto md:w-2/3 md:mx-auto px-4 py-8 space-y-6 bg-white shadow-lg rounded-3xl lg:px-12">
                    <div className="">
                        <div className="mb-6 flex justify-center">
                            <img src={Logo} alt="Medb Logo" className="h-10 w-auto" />
                        </div>
                        {!registrationSuccess && !emailSent && (
                            <>
                                <h1 className="mb-2 text-2xl font-semibold text-gray-900 text-center">Create an Account</h1>
                                <p className="text-sm text-gray-500 text-center">Please enter your details</p>
                            </>
                        )}
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {!registrationSuccess && !emailSent && (
                            <>
                                <InputField type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField type="text" name="MiddleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} />
                                    <InputField type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                                </div>
                                <InputField type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                                {/*<InputField type="text" name="contactNo" placeholder="Contact Number" value={formData.contactNo} onChange={handleChange} required />*/}
                                <InputField type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} toggleable required />
                                <InputField type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} toggleable required />
                                <div className="min-h-[1.5rem]">
                                    {!passwordMatch && <p className="text-red-500 text-sm">Passwords do not match</p>}
                                </div>
                                <Button type="submit" className="h-12 w-full bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800" disabled={loading}>
                                    {loading ? "Registering..." : "Register"}
                                </Button>
                            </>
                        )}
                        {registrationSuccess && emailSent && (
                            <div className="text-center text-lg text-gray-600 mt-4">
                                <p className="text-green-700">Email verification has been sent to {formData.email}. Please check your inbox.</p>
                                <button onClick={() => navigate("/login")} type="button" className="text-violet-600 hover:text-violet-700 hover:underline mt-2">
                                    Go to Login
                                </button>
                            </div>
                        )}
                        {!registrationSuccess && !emailSent && (
                            <p className="text-center text-sm text-gray-600">
                                Already have an account? <button onClick={() => navigate("/login")} type="button" className="text-violet-600 hover:text-violet-700 hover:underline">Login</button>
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
