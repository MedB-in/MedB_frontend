import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import logo from "../../../assets/images/medb-logo-png.png";
import emailIcon from "../../../assets/images/email-icon.png";
import phoneIcon from "../../../assets/images/phone-icon2.png";
import locationIcon from "../../../assets/images/location-06.png";
import facebookIcon from "../../../assets/images/facebook-logo.png";
import linkedInIcon from "../../../assets/images/linkedin-icon.png";
import instagramIcon from "../../../assets/images/instagram-icon.png";
import { Link } from "react-router-dom";

const Footer = () => {

    const contactRef = useRef(null);
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState({
        role: "Doctor",
        name: "",
        phone: "",
        message: ""
    });

    useEffect(() => {
        const handleScroll = () => {
            contactRef.current?.scrollIntoView({ behavior: "smooth" });
        };

        window.addEventListener("scroll-to-contact", handleScroll);
        return () => window.removeEventListener("scroll-to-contact", handleScroll);
    }, []);

    const links = [
        { name: "Home", path: "/" },
        { name: "Features", path: "/for-doctor" },
        { name: "About Us", path: "" },
        { name: "For Doctor", path: "/for-doctor" },
        { name: "Contact Us", path: "" }
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
                                Mizone / Malabar Innovation <br />
                                Entrepreneurship Zone,<br />
                                Dharmasala, Kannur,<br />
                                Kerala 670567
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
                        >
                            Send
                        </motion.button>
                    </div>
                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        viewport={{ once: true, amount: 0.3 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="bg-white shadow-md p-4 mt-6 rounded-md space-y-4">
                        <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6F64E7]" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                            <option>Doctor</option>
                            <option>Patient</option>
                            <option>Other</option>
                        </select>
                        <input type="text" placeholder="Name" className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6F64E7]" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        <input type="text" placeholder="Phone Number" className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6F64E7]" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        <input type="text" placeholder="Message" className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6F64E7]" onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                        <button type="submit" className="w-full bg-[#6F64E7] text-white p-2 rounded-md hover:bg-[#554cd4] transition">Send</button>
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
                    <div className="flex justify-center md:justify-center">
                        <div className="text-[#6F64E7] hover:underline cursor-pointer">
                            Privacy Policy
                        </div>
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
