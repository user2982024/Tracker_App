import { CheckCircle } from "lucide-react";

const MilestoneCard = ({ title }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-2">

      <CheckCircle className="text-green-500" size={18} />

      <p className="text-sm">
        {title}
      </p>

    </div>
  );
};

export default MilestoneCard;