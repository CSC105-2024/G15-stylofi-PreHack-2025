import { CheckCircle2, XCircle } from "lucide-react";

const StatusMessage = ({ status, message }) => {
  if (!message) return null;

  const icon =
    status === "success" ? (
      <CheckCircle2 size={18} />
    ) : status === "error" ? (
      <XCircle size={18} />
    ) : null;

  const color =
    status === "success"
      ? "text-green-600"
      : status === "error"
        ? "text-red-600"
        : "text-gray-600";

  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium mt-2 ${color}`}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
};

export default StatusMessage;
