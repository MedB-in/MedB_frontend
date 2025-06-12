import { useEffect, useState } from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
    const [pagesToDisplay, setPagesToDisplay] = useState([]);

    const isMobile = window.innerWidth < 640;

    const generatePages = () => {
        let pages = [];

        if (isMobile) {
            if (totalPages <= 3) {
                pages = [...Array(totalPages).keys()].map((n) => n + 1);
            } else {
                if (currentPage === 1) {
                    pages = [1, 2, 3, "..."];
                } else if (currentPage === 2) {
                    pages = [1, 2, 3, "..."];
                } else if (currentPage === totalPages - 1) {
                    pages = ["...", totalPages - 2, totalPages - 1, totalPages];
                } else if (currentPage === totalPages) {
                    pages = ["...", totalPages - 2, totalPages - 1, totalPages];
                } else {
                    pages = ["...", currentPage - 1, currentPage, currentPage + 1, "..."];
                }
            }
        } else {
            // Full pagination for larger screens
            if (totalPages <= 7) {
                pages = [...Array(totalPages).keys()].map((n) => n + 1);
            } else {
                if (currentPage <= 4) {
                    pages = [1, 2, 3, 4, "...", totalPages];
                } else if (currentPage >= totalPages - 3) {
                    pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                } else {
                    pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
                }
            }
        }

        setPagesToDisplay(pages);
    };

    useEffect(() => {
        generatePages();
        // eslint-disable-next-line
    }, [currentPage, totalPages]);

    return (
        <div className="mt-6 flex justify-center items-center text-sm flex-wrap gap-1 sm:gap-2">
            <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-black hover:bg-indigo-400 rounded-2xl transition disabled:opacity-30"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                Prev
            </button>

            {pagesToDisplay.map((page, index) => (
                <button
                    key={index}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition font-medium ${
                        page === "..."
                            ? "text-gray-400 cursor-default"
                            : page === currentPage
                            ? "bg-indigo-700 text-white"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                    }`}
                    onClick={() => page !== "..." && setCurrentPage(page)}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            ))}

            <button
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-black hover:bg-indigo-400 transition rounded-2xl disabled:opacity-30"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
