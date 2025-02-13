const Button = ({ children, onClick, className = "", disabled = false, ...props }) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };
  
  export default Button;
  