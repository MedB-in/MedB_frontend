import { X } from "lucide-react";

const UploadPrescriptionModal = ({ showUploadModal, handleCloseModal, handleFileChange, handleUpload, previewImage, selectedFile, uploadError, uploading }) => {
    
    if (!showUploadModal) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                    onClick={handleCloseModal}
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-lg font-semibold mb-4">Upload Prescription</h3>

                <label
                    htmlFor="fileInput"
                    className="cursor-pointer inline-block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mb-2"
                >
                    Choose Image
                </label>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {previewImage && (
                    <img
                        src={previewImage}
                        alt="Prescription Preview"
                        className="h-full w-full object-contain rounded-md"
                    />
                )}

                {selectedFile && (
                    <div className="text-sm text-gray-700 mt-2 truncate">
                        Selected Filename: <span className="font-semibold">{selectedFile.name}</span>
                    </div>
                )}

                {uploadError && (
                    <div className="text-sm text-red-500 mt-2">{uploadError}</div>
                )}

                <button
                    onClick={handleUpload}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
                    disabled={!selectedFile}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>
        </div>
    );
};

export default UploadPrescriptionModal;
