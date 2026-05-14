import { AlertProps } from "../../types/FormTypes";

const Alert = ({ type = "info", message }: AlertProps) => {
  const alertStyles = {
    success: "bg-green-100 text-green-800 border-green-400",
    error: "bg-red-100 text-red-800 border-red-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
    loading: "bg-gray-100 text-gray-800 border-gray-400",
  };

  return (
    <div className={`border px-4 py-3 rounded mb-4 ${alertStyles[type]}`}>
      {message}
    </div>
  );
};

export default Alert;
