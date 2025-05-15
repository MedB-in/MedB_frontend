const CardComponent = ({ title, children }) => {
    return (
        <div className="bg-white border border-[#6F64E7] rounded-lg shadow-md my-10 p-6 m-4 relative">
            <div className="absolute -top-3 left-4 bg-white px-2">
                <h2 className="text-lg font-semibold text-gray-800">
                    {title} <span className="text-red-500">*</span>
                </h2>
            </div>
            <div className="mt-4">
                {children}
            </div>
        </div>
    );
};

export default CardComponent;