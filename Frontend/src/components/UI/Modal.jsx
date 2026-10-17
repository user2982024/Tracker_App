
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className="relative w-[90%] max-w-md rounded-2xl app-surface app-text p-6 shadow-xl"
      >
        {title && (
          <h2 className="mb-3 text-xl font-semibold">
            {title}
          </h2>
        )}

        <div className="mb-6 app-text-secondary">
          {children}
        </div>

        <div className="flex justify-end gap-3">
          {actions}
        </div>
      </div>
    </div>
  );
};

export default Modal;
