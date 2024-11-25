import { twMerge } from "tailwind-merge";

const Button = ({
  children,
  label,
  onClick,
  className,
  secondary,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "px-4 py-2 bg-accentColor200 text-white font-semibold rounded-lg hover:bg-accentColor outline-none",
        secondary && 'bg-transparent text-accentColor200 hover:text-accentColor hover:bg-transparent',
        className && className
      )}
      {...props}
    >
      {children || label}
    </button>
  );
};

export default Button;
