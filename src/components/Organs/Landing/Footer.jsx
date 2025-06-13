import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../../assets/images/medb-logo-png.png";
import emailIcon from "../../../assets/images/email-icon.png";
import phoneIcon from "../../../assets/images/phone-icon2.png";
import locationIcon from "../../../assets/images/location-06.png";
import facebookIcon from "../../../assets/images/facebook-logo.png";
import linkedInIcon from "../../../assets/images/linkedin-icon.png";
import instagramIcon from "../../../assets/images/instagram-icon.png";
import { subscribeNewsletter, sendEnquiry } from "../../../services/publicApi";
import { isValidEmail, isValidName, isValidPhone,  } from "../../../validation/validations";

const Footer = () => {

    const contactRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [formError, setFormError] = useState("");
    const [newsletterLoading, setNewsletterLoading] = useState(false);
    const [enquiryLoading, setEnquiryLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: "Doctor",
        name: "",
        phone: "",
        email: "",
        message: ""
    });

    useEffect(() => {
        const handleScroll = () => {
            contactRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        window.addEventListener("scroll-to-contact", handleScroll);
        return () => window.removeEventListener("scroll-to-contact", handleScroll);
    }, []);

    const handleNewsletterSubmit = async () => {
        if (!email.trim()) return toast.error("Please enter an email address");
        if (!isValidEmail(email)) return toast.error("Please enter a valid email");

        try {
            setNewsletterLoading(true);
            await subscribeNewsletter(email);
            toast.success("Subscribed successfully!");
            setEmail("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setNewsletterLoading(false);
        }
    };

    const goToHome = () => {
        if (location.pathname === '/') {
            window.dispatchEvent(new Event("scroll-to-home"));
        } else {
            navigate('/');
        }
    };

    const handleEnquirySubmit = async (e) => {
        e.preventDefault();
        const { role, name, phone, email, message } = formData;

        const setError = (msg) => {
            setFormError(msg);
            toast.error(msg);
            setTimeout(() => setFormError(""), 5000);
        };

        if (!role || !name || !phone || !email || !message) {
            return setError("Please fill in all fields.");
        }

        if (!isValidName(name)) {
            return setError("Name can only contain alphabets and spaces.");
        }

        if (!isValidPhone(phone)) {
            return setError("Please enter a valid Indian mobile number.");
        }

        if (!isValidEmail(email)) {
            return setError("Please enter a valid email address.");
        }

        const messageRegex = /^[a-zA-Z][a-zA-Z0-9\s.,!?'"()@#\-_:;]*$/;
        if (!messageRegex.test(message)) {
            return setError("Message must start with alphabets and contain only valid characters.");
        }

        const wordCount = message.trim().split(/\s+/).length;
        if (wordCount < 2) {
            return setError("Message must contain at least two words.");
        }

        try {
            setEnquiryLoading(true);
            await sendEnquiry(formData);
            toast.success("Enquiry sent successfully!");
            setFormData({
                role: "Doctor",
                name: "",
                phone: "",
                email: "",
                message: ""
            });
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong.");
        } finally {
            setEnquiryLoading(false);
        }
    };

    const links = [
        // { name: "Features", path: "/for-doctor" },
        { name: "About Us", path: "/about-us" },
        { name: "For Doctor", path: "/for-doctor" },
        { name: "For Clinic", path: "/for-clinic" },
        // { name: "Contact Us", path: "" }
    ]

    return (
        <motion.footer
            className="bg-gradient-to-b from-white via-white to-[#6F64E7]/30 text-center p-6"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            ref={contactRef}
        >
            <motion.div
                className="py-6 border-t border-b"
                initial={{ opacity: 0, scale: 0.9 }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <img src={logo} alt="MedB Logo" className="w-36 mx-auto" />
            </motion.div>
            <div className="flex flex-wrap md:flex-nowrap justify-between items-start px-6 py-8 gap-6 md:gap-12">
                <motion.div
                    className="w-full md:w-1/3 text-left"
                    initial={{ opacity: 0, y: 30 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <h3 className="text-xl font-semibold text-[#6F64E7] mb-4">Quick Links</h3>
                    <ul className="space-y-3 text-gray-700 text-sm md:text-base">
                        <div onClick={goToHome} className="hover:text-[#6F64E7] transition cursor-pointer">
                            Home
                        </div>
                        {links.map(link => (
                            <li key={link.name}>
                                <Link to={link.path} className="hover:text-[#6F64E7] transition">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </motion.div>
                <motion.div
                    className="w-full md:w-1/3 md:border-l md:pl-6 text-left"
                    initial={{ opacity: 0, y: 30 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h3 className="text-xl font-semibold text-[#6F64E7] mb-4">Contact Us</h3>
                    <div className="space-y-3 text-sm md:text-base text-gray-700">
                        <p className="flex items-center">
                            <img src={phoneIcon} className="mr-2 w-5 h-5 object-contain" alt="" />
                            <a href="tel:+918137854445" className="hover:underline">
                                +91 8137854445
                            </a>
                        </p>
                        <p className="flex items-center">
                            <img src={emailIcon} className="mr-2 w-5 h-5 object-contain" alt="" />
                            <a href="mailto:info@medb.co.in" className="hover:underline">
                                info@medb.co.in
                            </a>
                        </p>
                        <div className="flex">
                            <img src={locationIcon} className="mr-2 w-5 h-5 object-contain self-start" alt="" />
                            <p>
                                <a
                                    href="https://www.google.com/maps/place/Mizone+%2F+Malabar+Innovation+Entrepreneurship+Zone/@11.9840889,75.364086,1070m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3ba43f54946f7cdd:0x20d73d44cd69f732!8m2!3d11.9840837!4d75.3666609!16s%2Fg%2F11h3nn3bmp?entry=ttu&g_ep=EgoyMDI1MDYwMS4wIKXMDSoASAFQAw%3D%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    Medb connected care LLP <br />
                                    Mizone / Malabar Innovation <br />
                                    Entrepreneurship Zone,<br />
                                    Dharmasala, Kannur,<br />
                                    Kerala 670567
                                </a>
                            </p>
                        </div>

                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    viewport={{ once: true, amount: 0.3 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="w-full md:w-1/3 text-left"
                >
                    <h3 className="text-xl font-semibold text-[#6F64E7] mb-4">Newsletter</h3>
                    <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-2 mt-2 w-full max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="flex-1 outline-none px-2 text-gray-600 text-sm sm:text-base"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <motion.button
                            className="bg-[#6F64E7] text-white px-4 py-2 rounded-full hover:bg-[#554cd4] transition text-sm sm:text-base ml-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleNewsletterSubmit}
                        >
                            {newsletterLoading ? "Subscribing..." : "Subscribe"}
                        </motion.button>
                    </div>
                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        onSubmit={handleEnquirySubmit}
                        className="bg-white shadow-md p-4 mt-6 rounded-md space-y-4">
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6F64E7]" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                            <option>Doctor</option>
                            <option>Clinic</option>
                            <option>Patient</option>
                            <option>Other</option>
                        </select>
                        <input type="text" placeholder="Name" value={formData.name} className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6F64E7]" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <input type="text" placeholder="Phone Number" value={formData.phone} className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6F64E7]" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        <input type="email" placeholder="Email" value={formData.email} className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6F64E7]" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        <input type="text" placeholder="Message" value={formData.message} className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6F64E7]" onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                        <div className="min-h-[1rem]">
                            {formError ? (
                                <p className="text-red-600 text-sm text-center">{formError}</p>
                            ) : (
                                <p className="invisible text-sm">placeholder</p>
                            )}
                        </div>
                        <button type="submit" className="w-full bg-[#6F64E7] text-white p-2 rounded-md hover:bg-[#554cd4] transition">{enquiryLoading ? "Sending..." : "Submit"}</button>
                    </motion.form>
                </motion.div>
            </div>
            <motion.div
                className="border-t pt-4 mt-6 px-6 text-sm md:text-base"
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 items-center text-center md:text-left">
                    <p className="text-gray-600 md:justify-self-start">
                        © 2025 MEDB India. All rights reserved.
                    </p>
                    <div className="flex justify-center md:justify-center gap-2">
                        <Link to="/privacy-policy" className="text-[#6F64E7] hover:underline cursor-pointer">
                            Privacy Policy
                        </Link>
                        <div className="text-gray-600">|</div>
                        <Link to="/terms-and-conditions" className="text-[#6F64E7] hover:underline cursor-pointer">
                            Terms & Conditions
                        </Link>
                    </div>
                    <div className="flex justify-center md:justify-end space-x-4 mt-3 md:mt-0">
                        <motion.a
                            href="https://www.facebook.com/people/MedB/61550544957867/?mibextid=ZbWKwL"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={facebookIcon} alt="Facebook" className="w-6 hover:opacity-80 transition" />
                        </motion.a>
                        <motion.a
                            href="https://www.instagram.com/medb_app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={instagramIcon} alt="Instagram" className="w-6 hover:opacity-80 transition" />
                        </motion.a>
                        <motion.a
                            href="https://www.linkedin.com/company/medbindia/about/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={linkedInIcon} alt="LinkedIn" className="w-6 hover:opacity-80 transition" />
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </motion.footer>
    );
}

export default Footer;
