import { useId, forwardRef } from "react";

type InputProps = {
  label: string;
  type?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, type = "text", className, ...props },
  ref
) {
  const id = useId(); // Generate a unique id for input id
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="inline-block pl-1 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 ${className}`}
        ref={ref}
        {...props}
        id={id}
      />
    </div>
  );
});

export default Input;
