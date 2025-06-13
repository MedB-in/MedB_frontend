// import { useEffect, useRef, useState } from "react";
// import { getSignedUrl } from "../../services/patient";
// import * as pdfjsLib from "pdfjs-dist";

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// const PdfViewer = ({ url }) => {
//     const canvasRef = useRef(null);
//     const [signedUrl, setSignedUrl] = useState('');

//     useEffect(() => {
//         const fetchSignedUrl = async () => {
//             if (!url) return;
//             try {
//                 const response = await getSignedUrl(url);
//                 setSignedUrl(response.data.signedUrl);
//             } catch (error) {
//                 console.error("Error fetching signed URL:", error);
//             }
//         };
//         fetchSignedUrl();
//     }, [url]);

//     useEffect(() => {
//         if (!signedUrl) return;

//         const loadingTask = pdfjsLib.getDocument(signedUrl);
//         loadingTask.promise
//             .then((pdf) => {
//                 console.log("PDF loaded");
//                 return pdf.getPage(1);
//             })
//             .then((page) => {
//                 console.log("Page loaded");
//                 const scale = 1.5;
//                 const viewport = page.getViewport({ scale });

//                 const canvas = canvasRef.current;
//                 const context = canvas.getContext("2d");
//                 canvas.width = viewport.width;
//                 canvas.height = viewport.height;

//                 const renderContext = {
//                     canvasContext: context,
//                     viewport,
//                 };

//                 page.render(renderContext).promise.then(() => {
//                     console.log("Page rendered");
//                 });
//             })
//             .catch((error) => {
//                 console.error("Error rendering PDF:", error);
//             });
//     }, [signedUrl]);

//     return (
//         <div className="w-full overflow-auto border rounded-md">
//             <canvas ref={canvasRef} className="mx-auto" />
//         </div>
//     );
// };

// export default PdfViewer;