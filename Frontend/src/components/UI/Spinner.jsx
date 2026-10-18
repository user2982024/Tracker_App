import { Loader2 } from "lucide-react";

const Spinner = ({ size = 32, className = "", fullPage = false }) => {
  const content = (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 
        size={size} 
        className="animate-spin text-primary transition-colors duration-200"
      />
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Spinner;
