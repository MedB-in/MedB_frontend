import { AnimatePresence, motion } from "framer-motion";
import { FileText, ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import PrescriptionModal from "../../../components/Organs/Patient/PrescriptionModal";
import PrescriptionPreviewModal from "../../../components/Organs/Patient/PrescriptionPreviewModal";
import PrescriptionPrint from "../../../components/Organs/Patient/PrescriptionPrint";
import { getPrescriptionDataForPatient } from "../../../services/patient";

const PatientPrescription = () => {
    const [activeTab, setActiveTab] = useState("prescriptions");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [healthFiles, setHealthFiles] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePos, setImagePos] = useState({ x: 0, y: 0 });
    const [zoomLevel, setZoomLevel] = useState(1);

    const printRef = useRef(null);
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const patientId = userDetails?.userId;
    const patientName = [userDetails?.firstName, userDetails?.middleName, userDetails?.lastName].filter(Boolean).map(capitalize).join(" ");
    const age = userDetails?.age;
    const gender = userDetails?.gender;

    useEffect(() => {
        fetchPrescriptionData();
    }, []);

    const fetchPrescriptionData = async () => {
        try {
            setLoading(true);
            const response = await getPrescriptionDataForPatient(patientId);
            setPrescriptions(response.data.prescriptions || []);
            setHealthFiles(response.data.healthFiles || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    const handleZoom = (factor) => {
        setZoomLevel((prev) => Math.max(0.5, Math.min(prev + factor, 3)));
    };

    const handlePrint = () => window.print();

    return (
        <div className="min-h-screen px-4 py-8 bg-[#f0f0ff] rounded-3xl mt-5 md:mt-0">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6">My Records</h1>

                <div className="flex justify-center mb-6">
                    {["prescriptions", "health-files"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 font-semibold border-b-2 transition-all duration-300 ${activeTab === tab
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-blue-500"
                                }`}
                        >
                            {tab === "prescriptions" ? "Prescriptions" : "Health Files"}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "prescriptions" ? (
                        <motion.div
                            key="prescriptions"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.3 }}
                        >
                            {prescriptions.length === 0 && !loading ? (
                                <p className="text-center text-gray-500">No prescriptions available.</p>
                            ) : (
                                <div className="grid gap-6">
                                    {prescriptions.map((file) => (
                                        <div
                                            key={file.appointmentId}
                                            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                                            onClick={() => {
                                                setSelectedRecord(file);
                                                setShowModal(true);
                                            }}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Appointment Date</span>
                                                    <span className="font-semibold text-gray-900">{formatDate(file.appointmentDate)}</span>

                                                    <span className="text-xs text-gray-400 uppercase tracking-wide mt-2">For</span>
                                                    <span className="font-medium text-gray-800 capitalize">{file.bookFor || patientName}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Doctor</span>
                                                    <span className="font-semibold text-gray-900 truncate">
                                                        Dr. {file.doctor.firstName} {file.doctor.middleName || ""} {file.doctor.lastName || ""}
                                                    </span>
                                                    <span className="text-sm text-gray-600 truncate">{file.doctor.speciality}</span>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Clinic</span>
                                                    <span className="font-semibold text-gray-900 truncate">{file.clinic.name || "N/A"}</span>
                                                    <span className="text-sm text-gray-600 truncate">{file.clinic.address || "N/A"}</span>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-100 mt-4 pt-4">
                                                <span className="text-xs text-gray-400">Appointment ID: {file.appointmentId}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="health-files"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid gap-6">
                                {healthFiles.length > 0 ? (
                                    healthFiles.map((item, index) => {
                                        const isPDF = item.fileUrl?.endsWith(".pdf");

                                        return (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setSelectedImage(item.fileUrl);
                                                    setZoomLevel(1);
                                                    setImagePos({ x: 0, y: 0 });
                                                }}
                                                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="flex items-start gap-3 min-w-0">
                                                        <div>
                                                            {isPDF ? (
                                                                <FileText className="text-indigo-500 w-6 h-6 group-hover:scale-110 transition" />
                                                            ) : (
                                                                <ImageIcon className="text-indigo-500 w-6 h-6 group-hover:scale-110 transition" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm text-gray-500">File Name</p>
                                                            <p className="text-sm text-gray-700 font-semibold truncate">{item?.fileName}</p>
                                                            <p className="text-sm text-gray-500 mt-1">Uploaded on</p>
                                                            <p className="text-sm text-gray-800 font-medium">
                                                                {new Date(item?.createdOn).toLocaleDateString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-gray-500">Doctor</p>
                                                        <p className="font-medium text-gray-700 capitalize truncate">
                                                            Dr. {item.doctor.firstName} {item.doctor.middleName || ""} {item.doctor.lastName || ""}
                                                        </p>
                                                        <p className="text-sm text-gray-600 truncate">{item.doctor.speciality}</p>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm text-gray-500">Clinic</p>
                                                        <p className="font-medium text-gray-700 truncate">{item.clinic.name || "N/A"}</p>
                                                        <p className="text-sm text-gray-600 truncate">{item.clinic.address || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full text-sm text-gray-500">No health files uploaded yet.</div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {showModal && selectedRecord && (
                <PrescriptionModal
                    selectedRecord={selectedRecord}
                    patientName={patientName}
                    setShowModal={setShowModal}
                    handlePrint={handlePrint}
                />
            )}

            <PrescriptionPrint
                printRef={printRef}
                selectedRecord={selectedRecord}
                patientName={patientName}
                age={age}
                gender={gender}
            />

            {selectedImage && (
                <PrescriptionPreviewModal
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}
                    zoomLevel={zoomLevel}
                    setZoomLevel={setZoomLevel}
                    handleZoom={handleZoom}
                    imagePos={imagePos}
                    setImagePos={setImagePos}
                />
            )}
        </div>
    );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export default PatientPrescription;