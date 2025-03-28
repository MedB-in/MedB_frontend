import { useState, useEffect, useRef } from "react";
import notebook from "../../../assets/images/notebook-02.png";
import whatsapp from "../../../assets/images/whatsapp-icon.png";

const FloatingButtons = () => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [position, setPosition] = useState({
        x: window.innerWidth - 60,
        y: window.innerHeight / 2
    });

    const [isDragging, setIsDragging] = useState(false);
    const btnRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const newScreenWidth = window.innerWidth;
            setScreenWidth(newScreenWidth);

            setPosition((prev) => ({
                x: newScreenWidth - 60,
                y: Math.min(prev.y, window.innerHeight - 90)
            }));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const handleMove = (e) => {
            if (!isDragging) return;

            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const maxY = window.innerHeight - 200;
            const minY = 100;

            setPosition((prev) => ({
                ...prev,
                y: Math.min(maxY, Math.max(minY, clientY))
            }));
        };

        const stopDragging = () => {
            if (!isDragging) return;
            setIsDragging(false);
            setPosition((prev) => ({
                x: screenWidth - 80,
                y: prev.y
            }));
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", stopDragging);
        window.addEventListener("touchmove", handleMove);
        window.addEventListener("touchend", stopDragging);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", stopDragging);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("touchend", stopDragging);
        };
    }, [isDragging, screenWidth]);

    return (
        <>
            <div
                ref={btnRef}
                style={{ top: position.y, left: `${screenWidth - 60}px` }}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
                className="fixed flex items-center bg-[#6F64E7] text-white rounded-l-lg z-50 cursor-pointer hover:opacity-90
                           w-[55px] h-[45px] md:w-[65px] md:h-[60px] p-2 pr-3 md:pr-6 shadow-lg transition-transform duration-300 ease-in-out"
                title="Send us a message"
            >
                <img src={notebook} alt="Message" className="w-full h-full object-contain" />
            </div>
            <a
                href="https://api.whatsapp.com/send/?phone=8137854445&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-5 right-4 md:right-9 md:bottom-10 flex items-center animate-pulse bg-[#17B958] text-white rounded-full z-50 cursor-pointer shadow-lg
                           hover:scale-105 transition-transform duration-300 ease-in-out
                           w-[55px] h-[55px] md:w-[65px] md:h-[65px] p-2 md:p-3"
                title="Chat on WhatsApp"
            >
                <img src={whatsapp} alt="WhatsApp" className="w-full h-full object-contain" />
            </a>
        </>
    );
};

export default FloatingButtons;
