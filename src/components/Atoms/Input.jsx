const InputField = ({ label, name, type, value, onChange, readOnly, required }) => {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={!onChange ? undefined : onChange}
        className={`w-full p-2 border rounded-md ${readOnly ? "cursor-default bg-gray-100" : ""}`}
        readOnly={readOnly}
        required={required}
      />
    </div>
  );
};
export default InputField;