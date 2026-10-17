import { useEffect } from "react";
import { X } from "lucide-react";

const FormModal = ({
  isOpen,
  onClose,
  title,
  subtitle = "Complete the details below",
  children,
  loading = false,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onClose?.();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !loading) onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6"
      role="presentation"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface text-foreground shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label={`Close ${title.toLowerCase()}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground-muted transition hover:bg-surface-secondary hover:text-foreground disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          {children}
        </div>
      </section>
    </div>
  );
};

export default FormModal;
