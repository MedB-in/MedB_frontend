const Button = ({ children, variant = "primary", onClick, className = "", disabled }) => {
  const baseStyles = `flex overflow-hidden ${variant === 'primary' ? 'hover:bg-indigo-600' : 'hover:bg-grey-400'} flex-col justify-center mt-6 max-w-full text-sm font-medium tracking-normal leading-5 text-center min-h-[48px] rounded-[100px] w-[418px] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`;

  const variants = {
    primary: "text-white bg-indigo-500",
    secondary: "text-indigo-500 text-opacity-70 border border-indigo-500 border-solid",
    outline: "text-gray-700 bg-white border border-gray-700"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      <div className={`flex-1 py-3.5 pr-11 pl-14 w-full ${variant === 'primary' ? 'bg-white bg-opacity-10' : 'bg-white'} max-md:px-5`}>
        {children}
      </div>
    </button>
  );
};

export default Button;
