import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

const TermsAndConditions = () => {
    return (
        <div
            className="bg-white py-20 pt-28 px-6 sm:px-10 md:px-16 lg:px-32 text-gray-800"
        >
            <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-center mb-8 text-[#6F64E7]"
            >
                Terms and Conditions
            </motion.h1>

            <motion.div layout
                initial="hidden"
                animate="visible"
                variants={fadeInUp} className="space-y-6 text-center text-[17px] leading-relaxed">
                <p>
                    Welcome to MedB. By accessing or using our application, you agree to be bound by these Terms and Conditions. Please read them carefully before using our services.
                </p>

                <h2 className="text-xl font-semibold text-[#6F64E7] mt-6">1. Acceptance of Terms</h2>
                <p>
                    By creating an account or using any part of the MedB platform, you accept these terms and our Privacy Policy. If you do not agree, please do not use the app.
                </p>

                <h2 className="text-xl font-semibold text-[#6F64E7]">2. Use of Services</h2>
                <p>
                    MedB provides healthcare-related services including appointment booking, doctor consultation, and clinic management. You agree to use these services responsibly and in accordance with applicable laws.
                </p>

                <h2 className="text-xl font-semibold text-[#6F64E7]">3. User Responsibilities</h2>
                <p>
                    You are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate and complete information and update it as necessary.
                </p>

                <h2 className="text-xl font-semibold text-[#6F64E7] text-center">4. Prohibited Activities</h2>
                <ul className="flex flex-col items-center list-disc list-inside mt-2">
                    <li>Misusing the app for illegal or unauthorized purposes</li>
                    <li>Attempting to gain unauthorized access to other user accounts or systems</li>
                    <li>Spamming or transmitting malicious software</li>
                </ul>

                <h2 className="text-xl font-semibold text-[#6F64E7]">5. Intellectual Property</h2>
                <p>
                    All content, trademarks, and services on MedB are the property of the company and protected under applicable laws. You may not use any content without prior written permission.
                </p>

                <h2 className="text-xl font-semibold text-[#6F64E7]">6. Limitation of Liability</h2>
                <p>
                    MedB is not liable for any direct, indirect, or consequential damages resulting from the use or inability to use the app. Healthcare decisions made via the app are the sole responsibility of the user.
                </p>

                <h2 className="text-xl font-semibold text-[#6F64E7]">7. Modifications</h2>
                <p>
                    We reserve the right to update or modify these Terms at any time. Continued use of the app after changes implies your acceptance of the revised terms.
                </p>

                <h2 className="text-xl font-semibold text-[#6F64E7]">8. Contact Us</h2>
                <p>
                    If you have any questions or concerns regarding these Terms, please contact us at:
                </p>
                <div className="text-sm text-gray-600">
                    <p>📍 Mizone / Malabar Innovation Entrepreneurship Zone, Dharmasala, Kannur, Kerala 670567</p>
                    <p>📞 +91 8137854445</p>
                    <p>📧 info@medb.co.in</p>
                </div>
            </motion.div>
        </div>
    );
};

export default TermsAndConditions;
