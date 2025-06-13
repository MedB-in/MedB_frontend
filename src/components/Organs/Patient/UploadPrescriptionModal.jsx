import { X } from "lucide-react";

const UploadPrescriptionModal = ({ showUploadModal, handleCloseModal, handleFileChange, handleUpload, previewImage, previewName, selectedFile, uploadError, uploading, fileName, setFileName, }) => {
    if (!showUploadModal) return null;

    const isPDF = selectedFile?.type === "application/pdf";

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
                    Choose File
                </label>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {selectedFile && (
                    <div className="mt-3 flex items-center gap-3">
                        {isPDF ? (
                            <>
                                <img
                                    src={previewImage}
                                    alt="PDF Icon"
                                    className="w-10 h-10"
                                />
                                <span className="text-sm text-gray-700 truncate">{previewName}</span>
                            </>
                        ) : (
                            <img
                                src={previewImage}
                                alt="Prescription Preview"
                                className="w-full h-64 object-contain rounded-md"
                            />
                        )}
                    </div>
                )}

                {uploadError && (
                    <div className="text-sm text-red-500 mt-2">{uploadError}</div>
                )}

                <label
                    htmlFor="fileNameInput"
                    className="block mt-4 mb-1 text-sm font-medium text-gray-700"
                >
                    File Name
                </label>
                <input
                    id="fileNameInput"
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-full"
                />

                <button
                    onClick={handleUpload}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
                    disabled={!selectedFile || uploading}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>
        </div>
    );
};

export default UploadPrescriptionModal;
