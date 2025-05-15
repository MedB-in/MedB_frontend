const TextAreaCard = ({ label, placeholder, value, onChange }) => {
    return (
        <div className="flex flex-col text-sm shadow-md rounded-xl p-3 text-gray-600">
            <label className="mb-2 text-center font-medium">{label}</label>
            <textarea
                className="bg-white h-[180px] border border-gray-300 rounded-xl p-4 resize-none"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default TextAreaCard;
