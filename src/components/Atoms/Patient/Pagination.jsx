
const Pagination = ({ currentPage, totalPages, setCurrentPage, generatePagination }) => {
    return (
        <div className="mt-6 flex justify-center items-center text-xs space-x-2">
            <button
                className="px-4 py-2 text-black hover:bg-indigo-400 rounded-2xl transition disabled:opacity-20"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            {generatePagination.map((page, index) => (
                <button
                    key={index}
                    className={`px-4 py-2 rounded-full transition ${page === "..."
                        ? "text-gray-400 cursor-default"
                        : page === currentPage
                            ? "bg-indigo-700 text-white font-bold"
                            : "bg-indigo-500 text-white hover:bg-indigo-600"
                        }`}
                    onClick={() => page !== "..." && setCurrentPage(page)}
                    disabled={page === "..."}
                >
                    {page}
                </button>
            ))}
            <button
                className="px-4 py-2 text-black hover:bg-indigo-400 transition rounded-2xl disabled:opacity-20"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
