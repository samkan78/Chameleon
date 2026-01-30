import { useState, useRef } from "react";
import type { ReactNode } from "react";
import ToastContext from "./ToastService";
import type { ToastContextType } from "./ToastService";

type ToastItem = {
  id: string;
  component: ReactNode;
};
// manages toast notifications

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  const open: ToastContextType["open"] = (component, timeout = 5000) => {
    // Generate unique ID using timestamp + counter
    const id = `${Date.now()}-${counterRef.current++}`;
    setToasts((prevToasts) => [...prevToasts, { id, component }]);
    setTimeout(() => close(id), timeout);
  };

  const close: ToastContextType["close"] = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };
  // provides context to children components and displays toasts
  // why: to show notifications
  return (
    <ToastContext.Provider value={{ open, close }}>
      {children}
      <div className="space-y-2 absolute bottom-4 right-4">
        {toasts.map(({ id, component }) => (
          <div key={id} className="relative">
            <button
              className="absolute top-2 right-2 p-1 rounded-lg bg-gray-200/20 text-gray-800/60"
              onClick={() => close(id)}
              aria-label="Close"
            >
              ×
            </button>
            {component}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
