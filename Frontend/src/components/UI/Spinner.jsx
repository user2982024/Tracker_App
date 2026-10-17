import { Loader2 } from "lucide-react";

const Spinner = ({
  size = 32,
  className = "",
  fullPage = false,
  label = "Loading",
}) => {
  const content = (
    <div
      className={`flex items-center justify-center gap-3 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <Loader2 
        size={size} 
        className="animate-spin text-primary transition-colors duration-200"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-background/70 backdrop-blur-sm"
        aria-busy="true"
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Spinner;
