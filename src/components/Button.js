const Button = ({ children, label, onClick, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 outline-none ${className}`}
      {...props}
    >
      {children || label}
    </button>
  );
};

export default Button;
