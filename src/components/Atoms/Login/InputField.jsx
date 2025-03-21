import { useState } from "react";
import ShowPasswordIcon from "../../../assets/images/show-password-icon.svg";


const InputField = ({
  id,
  type,
  name,
  placeholder,
  icon,
  value,
  onChange,
  toggleable,
  disabled,
  ariaLabel,
  className
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="flex overflow-hidden gap-1 px-3 py-3.5 bg-white rounded-lg border border-solid border-zinc-300 text-black text-opacity-70">
      {icon && (
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain shrink-0 my-auto aspect-square w-[19px]"
        />
      )}
      <label htmlFor={id} className="sr-only">
        {ariaLabel || placeholder}
      </label>
      <input
        type={toggleable && isPasswordVisible ? "text" : type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`flex-auto bg-transparent border-none outline-none ${className}`}
      />
      {toggleable && (
        <button
          type="button"
          aria-label="Toggle password visibility"
          onClick={handleTogglePassword}
        >
          <img
            loading="lazy"
            src={ShowPasswordIcon}
            alt=""
            className="object-contain shrink-0 w-6 aspect-square"
          />
        </button>
      )}
    </div>
  );
};

export default InputField;
