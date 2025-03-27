import { motion } from "framer-motion";
import phoneIcon from "../../../assets/images/contact-02.png";
import webIcon from "../../../assets/images/website.png";
import clockIcon from "../../../assets/images/clock-01.png";
import back from "../../../assets/images/circle-arrow-left-01.png";

const SkeletonLoader = () => (
    <div className="pt-24 p-6">
        <div className="items-start px-6 md:px-12 pt-5 md:-mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <section className="bg-white p-4 md:p-12 rounded-xl shadow-md flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <figure className="w-full md:w-1/3 max-w-[300px] md:max-w-[411px]">
                <div className="w-full aspect-[1.25] bg-gray-300 animate-pulse rounded-xl md:rounded-3xl border border-gray-300"></div>
            </figure>
            <article className="w-full md:w-[630px] p-4 md:p-8 rounded-xl md:rounded-3xl border border-gray-300">
                <div className="mb-4 md:mb-6">
                    <div className="h-6 md:h-8 w-2/3 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                    <div className="h-5 md:h-6 w-3/4 bg-gray-300 rounded-md animate-pulse"></div>
                </div>
                <address className="flex flex-col gap-2 not-italic">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <div className="w-6 h-6 md:w-7 md:h-7 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="w-1/2 h-4 md:h-5 bg-gray-300 rounded-md animate-pulse"></div>
                        </div>
                    ))}
                    <div className="h-4 md:h-5 w-1/3 bg-gray-300 rounded-md animate-pulse mt-2"></div>
                </address>
            </article>
        </section>
    </div>
);

const ClinicDetail = ({ clinicData, loading }) => {
    if (loading) return <SkeletonLoader />;

    const ContactInfo = ({ icon, text, iconSize, isClosed, clickable }) => (
        <motion.div
            className={`flex gap-2 items-center ${isClosed ? 'text-red-500' : 'text-gray-700'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <img src={icon} alt="icon" className="object-contain" style={{ width: iconSize, height: iconSize }} />
            <p
                className={`text-sm font-medium ${clickable ? 'cursor-pointer underline' : ''}`}
                onClick={() => {
                    if (clickable) window.open(text, '_blank');
                }}
            >
                {text}
            </p>
        </motion.div>
    );

    const openingHours = clinicData?.openingHours || {};
    const closedDays = Object.entries(openingHours)
        .filter(([_, time]) => time === 'Closed')
        .map(([day]) => day);

    return (
        <div className="pt-24 p-6">
            <div
                className="items-start px-6 md:px-12 pt-5 md:-mb-4">
                <img src={back} alt="Back" className="cursor-pointer" onClick={() => window.history.back()} />
            </div>

            <section className="bg-white p-4 md:p-12 rounded-xl shadow-xl flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-8">
                <motion.figure
                    className="w-full md:w-1/3 max-w-[300px] md:max-w-[411px] rounded-xl md:rounded-3xl shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <img
                        src={clinicData?.clinicPicture || "https://via.placeholder.com/300"}
                        alt="Clinic"
                        className="object-cover w-full aspect-[1.25] mt-2 rounded-xl md:rounded-3xl border border-gray-300"
                    />
                </motion.figure>
                <motion.article
                    className="w-full md:w-[630px] text-center md:text-left px-4 md:mt-2 md:p-8 md:rounded-3xl md:border border-gray-300"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-lg md:text-2xl font-semibold text-gray-900 capitalize">{clinicData?.name || 'Clinic Name'}</h1>
                    <h2 className="text-sm md:text-xl text-gray-500">{clinicData?.address || 'N/A'} {clinicData?.district ? `(${clinicData?.district})` : ''} {clinicData?.city || ''}</h2>
                    <div className="w-full flex flex-col items-center md:items-start gap-3 mt-4 md:mt-6">
                        <ContactInfo icon={phoneIcon} text={clinicData?.contact || 'N/A'} iconSize="22px" />
                        <ContactInfo icon={webIcon} text={clinicData?.website || 'N/A'} iconSize="20px" clickable />
                        <ContactInfo icon={clockIcon} text={openingHours?.Monday || 'N/A'} iconSize="20px" />
                        {closedDays.length > 0 && (
                            <motion.p
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="text-red-500 text-sm md:text-base font-medium"
                            >
                                Closed on: {closedDays.join(", ")}
                            </motion.p>
                        )}
                    </div>
                </motion.article>
            </section>
        </div>
    );
};

export default ClinicDetail;
