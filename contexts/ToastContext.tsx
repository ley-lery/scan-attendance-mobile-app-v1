// app/components/toast/ToastContext.tsx
import { ToastViewport } from "@/components/ui/toast/ToastViewport";
import { ToastInternal, ToastOptions } from "@/types/toast.types";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ShowFn = (opts: ToastOptions | string) => string; // returns toast id
type DismissFn = (id: string) => void;
type ClearFn = () => void;

interface ToastContextValue {
  show: ShowFn;
  dismiss: DismissFn;
  clearAll: ClearFn;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULTS = {
  type: "info" as const,
  title: "",
  message: "",
  duration: 3500,
  position: "top" as const,
};

let counter = 0;
const genId = () => `toast_${Date.now()}_${counter++}`;

export const ToastProvider: React.FC<React.PropsWithChildren<{ maxVisible?: number }>> = ({
  children,
  maxVisible = 3,
}) => {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);
  const timers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const dismiss: DismissFn = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const scheduleAutoDismiss = useCallback((toast: ToastInternal) => {
    if (toast.duration <= 0) return;
    const timer: any = setTimeout(() => dismiss(toast.id), toast.duration);
    timers.current.set(toast.id, timer);
  }, [dismiss]);

  const show: ShowFn = useCallback((opts) => {
    const normalized: any = (() => {
      if (typeof opts === "string") {
        return { id: genId(), ...DEFAULTS, message: opts, createdAt: Date.now() };
      }
      return {
        id: opts.id ?? genId(),
        type: opts.type ?? DEFAULTS.type,
        title: opts.title ?? DEFAULTS.title,
        message: opts.message ?? DEFAULTS.message,
        duration: opts.duration ?? DEFAULTS.duration,
        position: opts.position ?? DEFAULTS.position,
        createdAt: Date.now(),
      };
    })();

    setToasts((prev) => {
      // keep queue (newest last)
      const next = [...prev, normalized];

      // enforce maxVisible *per position* (top and bottom independently)
      const clamp = (arr: ToastInternal[], position: "top" | "bottom") => {
        const filtered = arr.filter((t) => t.position === position);
        const overflow = Math.max(0, filtered.length - maxVisible);
        if (overflow > 0) {
          // drop oldest of that position
          const toDrop = filtered.slice(0, overflow).map((t) => t.id);
          return arr.filter((t) => !(t.position === position && toDrop.includes(t.id)));
        }
        return arr;
      };

      return clamp(clamp(next, "top"), "bottom");
    });

    // after state set, start auto-dismiss timer
    scheduleAutoDismiss(normalized);
    return normalized.id;
  }, [maxVisible, scheduleAutoDismiss]);

  const clearAll: ClearFn = useCallback(() => {
    setToasts([]);
    timers.current.forEach((t) => clearTimeout(t));
    timers.current.clear();
  }, []);

  const value = useMemo(() => ({ show, dismiss, clearAll }), [show, dismiss, clearAll]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Portals/containers for both positions */}
      <ToastViewport
        toasts={toasts.filter((t) => t.position === "top")}
        position="top"
        onDismiss={dismiss}
      />
      <ToastViewport
        toasts={toasts.filter((t) => t.position === "bottom")}
        position="bottom"
        onDismiss={dismiss}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
