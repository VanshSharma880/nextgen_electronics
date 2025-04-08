// @/components/ui/modal.tsx
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  onCancel: () => void;
  className?: string;
  footer?: React.ReactNode;
}

export function Modal({
  children,
  open,
  onCancel,
  className,
  footer,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative w-full max-w-2xl rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl",
          className
        )}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
