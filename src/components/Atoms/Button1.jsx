const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`rounded-lg transition font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
