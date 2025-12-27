import React, { useState } from "react";
import type { ReactNode } from "react";
import ToastContext from "./ToastService";
import type { ToastContextType } from "./ToastService";

// ...rest of your code
type ToastItem = {
  id: number;
  component: ReactNode;
};

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const open: ToastContextType["open"] = (component, timeout = 5000) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, component }]);
    setTimeout(() => close(id), timeout);
  };

  const close: ToastContextType["close"] = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

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
