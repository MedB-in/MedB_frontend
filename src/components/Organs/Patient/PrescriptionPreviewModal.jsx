import { useRef, useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";

const PrescriptionPreviewModal = ({ selectedImage, handleZoom, setSelectedImage, zoomLevel, imagePos, setImagePos }) => {
    if (!selectedImage) return null;

    const isPdf = selectedImage.endsWith('.pdf');

    const dragRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const startDrag = (e) => {
        if (isPdf) return; 
        setIsDragging(true);
        setDragStart({
            x: e.clientX - imagePos.x,
            y: e.clientY - imagePos.y,
        });
    };

    const onDrag = (e) => {
        if (!isDragging || isPdf) return; 
        setImagePos({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const stopDrag = () => {
        setIsDragging(false);
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-black bg-opacity-70 p-5 flex items-center justify-center">
            <div className="relative w-full h-screen bg-white rounded-xl shadow-lg flex flex-col"> 
                <button
                    className="absolute top-4 right-4 text-gray-700 hover:text-black z-10"
                    onClick={() => setSelectedImage(null)}
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Preview</h3>
                </div>

                {!isPdf && (
                    <div className="flex justify-end items-center p-4 border-b">
                        <div className="space-x-2">
                            <button onClick={() => handleZoom(0.2)} className="p-2 bg-gray-200 rounded">
                                <ZoomIn className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleZoom(-0.2)} className="p-2 bg-gray-200 rounded">
                                <ZoomOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                <div
                    ref={dragRef}
                    onMouseDown={startDrag}
                    onMouseMove={onDrag}
                    onMouseUp={stopDrag}
                    onMouseLeave={stopDrag}
                    className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center"
                    style={{ cursor: isPdf ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
                >
                    {isPdf ? (
                        <iframe
                            src={selectedImage}
                            title="Prescription PDF"
                            className="w-full h-full"
                            style={{ border: "none" }}
                        >
                            Your browser does not support PDFs. <a href={selectedImage} target="_blank" rel="noopener noreferrer">Download the PDF</a>.
                        </iframe>
                    ) : (
                        <img
                            src={selectedImage}
                            alt="Prescription"
                            style={{
                                transform: `scale(${zoomLevel}) translate(${imagePos.x}px, ${imagePos.y}px)`,
                                transition: isDragging ? "none" : "transform 0.2s",
                                maxHeight: "100%",
                                maxWidth: "100%",
                                display: "block",
                                margin: "auto",
                                userSelect: "none",
                            }}
                            draggable="false"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionPreviewModal;