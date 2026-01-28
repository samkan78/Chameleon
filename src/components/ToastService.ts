import { createContext } from "react";
import type { ReactNode } from "react";

export type ToastContextType = {
  open: (component: ReactNode, timeout?: number) => void;
  close: (id: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  open: () => {},
  close: () => {},
});

export default ToastContext;