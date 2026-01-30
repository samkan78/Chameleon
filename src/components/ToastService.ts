import { createContext } from "react";
import type { ReactNode } from "react";
// context type for toast notifications
export type ToastContextType = {
  open: (component: ReactNode, timeout?: number) => void;
  close: (id: string) => void;
};
// create toast context with default empty functions
const ToastContext = createContext<ToastContextType>({
  open: () => {},
  close: () => {},
});

export default ToastContext;
