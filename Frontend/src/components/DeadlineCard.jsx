import { AlertCircle } from "lucide-react";

const DeadlineCard = ({ title }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-2">

      <AlertCircle className="text-red-500" size={18} />

      <p className="text-sm">
        {title}
      </p>

    </div>
  );
};

export default DeadlineCard;