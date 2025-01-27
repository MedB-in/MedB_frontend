import * as React from "react";

function Button({ children, variant = "primary", onClick }) {
    const baseStyles = "flex overflow-hidden flex-col justify-center mt-6 max-w-full text-sm font-medium tracking-normal leading-5 text-center min-h-[48px] rounded-[100px] w-[418px]";
    const variants = {
      primary: "text-white bg-indigo-500",
      secondary: "text-indigo-500 text-opacity-70 border border-indigo-500 border-solid"
    };
  
    return (
      <button 
        onClick={onClick}
        className={`${baseStyles} ${variants[variant]}`}
      >
        <div className={`flex-1 py-3.5 pr-11 pl-14 w-full ${variant === 'primary' ? 'bg-white bg-opacity-10' : 'bg-white'} max-md:px-5`}>
          {children}
        </div>
      </button>
    );
  }

export default Button;