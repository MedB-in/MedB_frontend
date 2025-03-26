import { motion } from "framer-motion";
import phoneIcon from "../../../assets/images/contact-02.png";
import webIcon from "../../../assets/images/website.png";
import clockIcon from "../../../assets/images/clock-01.png";
import back from "../../../assets/images/circle-arrow-left-01.png";

const SkeletonLoader = () => (
    <motion.div
        className="pt-24 p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
    >
        <motion.div className="items-start px-6 md:px-12 pt-5 md:-mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
        </motion.div>

        <section className="flex flex-col md:flex-row items-center md:items-start p-6 md:p-12 bg-white gap-8">
            <motion.figure
                className="w-full md:w-1/3 max-w-[411px]"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
            >
                <div className="object-cover w-full rounded-3xl border border-stone-300 aspect-[1.25] bg-gray-300 animate-pulse"></div>
            </motion.figure>

            <motion.article
                className="w-full md:w-[630px] p-8 rounded-3xl border border-stone-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <div className="mb-6">
                    <div className="h-8 w-2/3 bg-gray-300 rounded-md animate-pulse mb-2"></div>
                    <div className="h-6 w-3/4 bg-gray-300 rounded-md animate-pulse"></div>
                </div>

                <address className="flex flex-col gap-2 not-italic">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <div className="w-7 h-7 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="w-1/2 h-5 bg-gray-300 rounded-md animate-pulse"></div>
                        </div>
                    ))}
                    <div className="h-5 w-1/3 bg-gray-300 rounded-md animate-pulse mt-2"></div>
                </address>
            </motion.article>
        </section>
    </motion.div>
);

const ClinicDetail = ({ clinicData, loading }) => {
    if (loading) return <SkeletonLoader />;

    const ContactInfo = ({ icon, text, iconSize, isClosed, clickable }) => (
        <motion.div
            className={`flex gap-2 items-center ${isClosed ? 'text-red-500' : 'text-black text-opacity-80'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <img src={icon} alt="icon" style={{ width: iconSize, height: iconSize }} className="object-contain" />
            <p
                className={`text-nd font-medium break-all ${clickable ? 'cursor-pointer underline' : ''}`}
                onClick={() => {
                    if (clickable) {
                        window.open(text, '_blank');
                    }
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
        <motion.div
            className="pt-24 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div className="items-start px-6 md:px-12 pt-5 md:-mb-4" >
                <img src={back} alt="Back" className="cursor-pointer" onClick={() => window.history.back()} />
            </motion.div>

            <section className="flex flex-col md:flex-row items-center md:items-start md:p-12 md:mt-9 mt-10 bg-white gap-8">
                <motion.figure
                    className="w-full md:w-1/3 max-w-[411px]"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <img
                        src={clinicData?.clinicPicture || "https://via.placeholder.com/411"}
                        alt="Clinic"
                        className="object-cover w-full rounded-3xl border border-stone-300 aspect-[1.25]"
                    />
                </motion.figure>

                <motion.article
                    className="w-full md:w-[630px] p-8 rounded-3xl border border-stone-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <header className="mb-6">
                        <h1 className="text-2xl capitalize font-medium text-black max-md:text-3xl">{clinicData?.name || 'Clinic Name'}</h1>
                        <h2 className="text-xl capitalize font-medium text-zinc-500 max-md:text-xl">{clinicData?.address || 'N/A'} {clinicData?.district ? `(${clinicData?.district})` : ''} {clinicData?.city || ''}</h2>
                    </header>

                    <address className="flex flex-col gap-2 not-italic">
                        <ContactInfo icon={phoneIcon} text={clinicData?.contact || 'N/A'} iconSize="28px" />
                        <ContactInfo icon={webIcon} text={clinicData?.website || 'N/A'} iconSize="24px" clickable />
                        <ContactInfo icon={clockIcon} text={openingHours?.Monday || 'N/A'} iconSize="24px" />
                        {closedDays.length > 0 && (
                            <motion.p initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }} className="text-red-500 text-base font-medium">Closed on: {closedDays.join(", ")}</motion.p>
                        )}
                    </address>
                </motion.article>
            </section>
        </motion.div>
    );
};

export default ClinicDetail;