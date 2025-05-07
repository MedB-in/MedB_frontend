import { useState } from "react";
import ShowPasswordIcon from "../../../assets/images/show-password-icon.svg";

const InputField = ({
  id,
  type,
  rows,
  name,
  placeholder,
  icon,
  value,
  onChange,
  toggleable,
  disabled,
  pattern,
  maxLength,
  title,
  ariaLabel,
  className,
  required
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePassword = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const inputType = toggleable && isPasswordVisible ? "text" : type;

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

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          title={title}
          rows={rows || 4}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`flex-auto bg-transparent border-none outline-none resize-none ${className}`}
        />
      ) : (
        <input
          type={inputType}
          id={id}
          name={name}
          placeholder={placeholder}
          title={title}
          maxLength={maxLength}
          pattern={pattern}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`flex-auto bg-transparent border-none outline-none ${className}`}
          onKeyDown={(e) => {
            if (
              type === "tel" &&
              !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key) &&
              !/^[0-9]$/.test(e.key)
            ) {
              e.preventDefault();
            }
          }}
        />
      )}

      {toggleable && type === "password" && (
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