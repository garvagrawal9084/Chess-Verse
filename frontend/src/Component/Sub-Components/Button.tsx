import { ReactNode } from "react";

const Button = ({
  children,
  type = "button",
  className = "",
  bgColor = "bg-green-500",
  textColor = "text-white",
  onClick,
  disabled = false,
  ...props
}: {
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  bgColor?: string;
  textColor?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type={type}
      className={`px-8 py-2 rounded-lg ${className} ${bgColor} ${textColor}`}
      onClick={() => {
        console.log("Button clicked!");
        if (onClick) onClick();
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
