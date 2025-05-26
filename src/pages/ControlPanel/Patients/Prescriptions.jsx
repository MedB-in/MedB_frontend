import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPrescriptions, uploadPrescription } from "../../../services/patient";
import { ArrowLeft, Upload } from "lucide-react";
import toast from "react-hot-toast";
import PrescriptionPreviewModal from "../../../components/Organs/Patient/PrescriptionPreviewModal";
import UploadPrescriptionModal from "../../../components/Organs/Patient/UploadPrescriptionModal";
import BackButton from "../../../components/Atoms/BackButton";


const Prescriptions = () => {
    const { patientId, doctorId, clinicId, appointmentId, appointmentDate } = useParams();
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [imagePos, setImagePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (doctorId || patientId) {
            fetchPrescriptions();
        }
    }, [doctorId, patientId]);

    const fetchPrescriptions = useCallback(async () => {
        const response = await getPrescriptions(patientId, doctorId);
        setPrescriptions(response.data.result || []);
    }, [patientId, doctorId]);



    const handleZoom = (factor) => {
        setZoomLevel((prev) => Math.max(0.5, Math.min(prev + factor, 3)));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setUploadError("");

        if (!file) return;
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

        if (!allowedTypes.includes(file.type)) {
            setUploadError("Only JPG, PNG, and WEBP images are allowed.");
            toast.error("Only JPG, PNG, and WEBP images are allowed.");
            setSelectedFile(null);
            return;
        }

        if (file.size > maxSize) {
            setUploadError("File size should not exceed 5MB.");
            toast.error("File size should not exceed 5MB.");
            setSelectedFile(null);
            return;
        }

        setUploadError("");
        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        setUploading(true);
        if (selectedFile) {
            handleFileChange({ target: { files: [selectedFile] } });
        }
        setUploadError("");

        const formData = new FormData();
        formData.append("clinicId", clinicId);
        formData.append("appointmentId", appointmentId);
        formData.append("appointmentDate", appointmentDate);
        formData.append("image", selectedFile);
        try {
            await uploadPrescription(patientId, doctorId, formData);
            setShowUploadModal(false);
            fetchPrescriptions();
            handleCloseModal();
        } catch (error) {
            setUploadError(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        finally {
            setUploading(false);
        }
    }

    const handleCloseModal = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setPreviewImage(null);
        setUploadError("");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <BackButton />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Prescriptions</h2>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    <Upload className="w-4 h-4" /> Upload
                </button>
            </div>

            <div className="grid gap-3">
                {prescriptions.length > 0 ? (
                    prescriptions.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setSelectedImage(item.fileUrl);
                                setZoomLevel(1);
                                setImagePos({ x: 0, y: 0 });
                            }}
                            className="cursor-pointer p-4 border rounded-md hover:bg-gray-50 transition"
                        >
                            <div className="text-sm font-medium text-indigo-600">Date: {item.appointmentDate}</div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-500">No prescriptions found.</div>
                )}
            </div>

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

            {showUploadModal && (
                <UploadPrescriptionModal
                    showUploadModal={showUploadModal}
                    handleCloseModal={handleCloseModal}
                    handleFileChange={handleFileChange}
                    handleUpload={handleUpload}
                    previewImage={previewImage}
                    selectedFile={selectedFile}
                    uploadError={uploadError}
                    uploading={uploading}
                />
            )}
        </div>
    );
};

export default Prescriptions;
