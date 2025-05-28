import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPrescriptions, uploadPrescription } from "../../../services/patient";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
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
    const [fileName, setFileName] = useState("");

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
            const errMsg = "Only JPG, PNG, and WEBP images are allowed.";
            setUploadError(errMsg);
            toast.error(errMsg);
            setSelectedFile(null);
            return;
        }

        if (file.size > maxSize) {
            const errMsg = "File size should not exceed 5MB.";
            setUploadError(errMsg);
            toast.error(errMsg);
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        setUploading(true);
        setUploadError("");
        if (!fileName) {
            const errMsg = "Please enter a file name.";
            setUploadError(errMsg);
            toast.error(errMsg);
            setUploading(false);
            return;
        }
        const formData = new FormData();
        formData.append("clinicId", clinicId);
        formData.append("appointmentId", appointmentId);
        formData.append("appointmentDate", appointmentDate);
        formData.append("image", selectedFile);
        formData.append("fileName", fileName || selectedFile.name);

        try {
            await uploadPrescription(patientId, doctorId, formData);
            fetchPrescriptions();
            handleCloseModal();
            toast.success("Prescription uploaded successfully.");
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong";
            setUploadError(message);
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    const handleCloseModal = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setPreviewImage(null);
        setUploadError("");
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <BackButton />

            <div className="flex justify-between items-center mb-6 mt-5">
                <h2 className="text-xl font-semibold text-gray-800">Health Files / Prescriptions</h2>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <Upload className="w-4 h-4" /> Upload Prescription
                </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {prescriptions.length > 0 ? (
                    prescriptions.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setSelectedImage(item.fileUrl);
                                setZoomLevel(1);
                                setImagePos({ x: 0, y: 0 });
                            }}
                            className="cursor-pointer border rounded-xl p-4 hover:shadow-md transition group"
                        >
                            <div className="flex items-center gap-3">
                                <ImageIcon className="text-indigo-500 group-hover:scale-110 transition" />
                                <div>
                                    <div className="text-sm text-gray-600 capitalize">{item?.fileName}</div>
                                    <div className="text-sm text-gray-600">Uploaded on</div>
                                    <div className="font-semibold text-gray-900">{item.appointmentDate}</div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-sm text-gray-500">No prescriptions uploaded yet.</div>
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
                    fileName={fileName}
                    setFileName={setFileName}
                />
            )}
        </div>
    );
};

export default Prescriptions;
