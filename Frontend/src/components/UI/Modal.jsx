import { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleEsc);

    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6">
        {title && <h2 className="text-xl font-semibold mb-3">{title}</h2>}

        <div className="text-gray-600 mb-6">{children}</div>

        <div className="flex justify-end gap-3">{actions}</div>
      </div>
    </div>
  );
};

export default Modal;