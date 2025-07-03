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
            <div className="max-w-4xl mx-auto">
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
                                            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
                                            onClick={() => {
                                                setSelectedRecord(file);
                                                setShowModal(true);
                                            }}
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                                <div>
                                                    <p className="text-sm text-gray-500">Appointment Date</p>
                                                    <p className="font-semibold text-lg text-gray-800">
                                                        {formatDate(file.appointmentDate)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Doctor</p>
                                                    <p className="font-medium text-gray-700 capitalize">
                                                        {file.doctor.firstName} {file.doctor.middleName || ""} {file.doctor.lastName || ""}
                                                    </p>
                                                    <span>{file.doctor.speciality}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Clinic</p>
                                                    <p className="font-medium text-gray-700">{file.clinic.name || "N/A"}</p>
                                                    <span>{file.clinic.address || "N/A"}</span>
                                                </div>
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
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                                className="cursor-pointer border rounded-xl bg-white p-4 hover:shadow-md transition group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {isPDF ? (
                                                        <FileText className="text-indigo-500 w-6 h-6 group-hover:scale-110 transition" />
                                                    ) : (
                                                        <ImageIcon className="text-indigo-500 w-6 h-6 group-hover:scale-110 transition" />
                                                    )}
                                                    <div>
                                                        <div className="text-sm text-gray-600 capitalize">{item?.fileName}</div>
                                                        <div className="text-sm text-gray-600">Uploaded on</div>
                                                        <div className="font-semibold text-gray-900">
                                                            {new Date(item.createdOn).toLocaleDateString('en-GB', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </div>
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