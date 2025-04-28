import { useRef, useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";

const PrescriptionPreviewModal = ({ selectedImage, handleZoom, setSelectedImage, zoomLevel, imagePos, setImagePos }) => {
    if (!selectedImage) return null;

    const dragRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const startDrag = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - imagePos.x,
            y: e.clientY - imagePos.y,
        });
    };

    const onDrag = (e) => {
        if (!isDragging) return;
        setImagePos({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const stopDrag = () => {
        setIsDragging(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                    className="absolute top-4 right-4 text-gray-700 hover:text-black z-10"
                    onClick={() => setSelectedImage(null)}
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Prescription Preview</h3>
                </div>

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

                <div
                    ref={dragRef}
                    onMouseDown={startDrag}
                    onMouseMove={onDrag}
                    onMouseUp={stopDrag}
                    onMouseLeave={stopDrag}
                    className="flex-1 overflow-hidden cursor-grab bg-gray-100"
                >
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
                </div>
            </div>
        </div>
    );
};

export default PrescriptionPreviewModal;
