import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 1) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

const PrivacyPolicyMain = () => {
    return (
        <div className="bg-white py-16 pt-28 px-6 sm:px-10 md:px-16 lg:px-32 text-gray-800">
            <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-3xl sm:text-4xl font-bold mb-8 text-[#6F64E7] text-center"
            >
                Privacy Policy
            </motion.h1>

            <motion.p
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-sm text-gray-500 text-center mb-8"
            >
                Effective Date: [01/01/2025] | Last Updated: [01/04/2025]
            </motion.p>
            <div className="space-y-12">
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        custom={index + 2}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-col lg:flex-row lg:gap-8 space-y-4 lg:space-y-0"
                    >
                        <div className="lg:w-1/2">
                            <h2 className="text-xl sm:text-2xl font-semibold text-[#6F64E7]">
                                {section.title}
                            </h2>
                        </div>
                        <div className="lg:w-1/2 text-left lg:text-justify">
                            {Array.isArray(section.content) ? (
                                <ul className="list-disc list-inside space-y-2 text-base leading-relaxed">
                                    {section.content.map((item, idx) => (
                                        <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-base leading-relaxed">{section.content}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const sections = [
    {
        title: "1. Information We Collect",
        content: [
            "<strong>Personal Details:</strong> Name, email, phone number, etc.",
            "<strong>Health-related Data:</strong> Symptoms, consultation history.",
            "<strong>Device Info:</strong> IP address, browser type, mobile info.",
            "<strong>Location Data:</strong> If permission is granted.",
            "<strong>Usage Data:</strong> App interactions and preferences.",
        ],
    },
    {
        title: "2. How We Use Your Information",
        content: [
            "Manage your MedB account",
            "Send OTPs via SMS/WhatsApp (e.g., Sinch)",
            "Enable bookings, reminders, and consultations",
            "Improve app functionality",
            "Ensure compliance with laws",
        ],
    },
    {
        title: "3. Sharing Your Information",
        content: [
            "We do <strong>not</strong> sell your data. We may share it with:",
            "<strong>Service Providers:</strong> Like Sinch, Fast2SMS, Meta",
            "<strong>Doctors/Clinics:</strong> For your booked appointments",
            "<strong>Legal Bodies:</strong> When lawfully required",
        ],
    },
    {
        title: "4. Data Security",
        content:
            "Your data is stored securely with encryption and strict access control. We constantly monitor for security issues.",
    },
    {
        title: "5. Your Rights",
        content: [
            "Access or correct your data",
            "Request data deletion",
            "Withdraw marketing consent",
            "Raise concerns on data use",
        ],
    },
    {
        title: "6. Children's Privacy",
        content:
            "MedB is not intended for users under 18 without parental consent. We do not knowingly collect data from minors.",
    },
    {
        title: "7. Policy Updates",
        content:
            "We may update this policy and notify you of significant changes through the app or email.",
    },
    {
        title: "8. Contact Us",
        content: [
            "📞 <strong>+91 81378 54445</strong>",
            "📧 <strong>info@medb.co.in</strong>",
            "🏢 Mizone / Malabar Innovation Entrepreneurship Zone,<br /> Dharmasala, Kannur, Kerala 670567",
        ],
    },
];

export default PrivacyPolicyMain;
