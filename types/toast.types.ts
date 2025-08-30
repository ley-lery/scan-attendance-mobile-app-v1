// app/components/toast/toast.types.ts
export type ToastType = "success" | "error" | "warning";
export type ToastPosition = "top" | "bottom";

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  message?: string;
  duration?: number; // ms
  position?: ToastPosition;
  id?: string; // custom id (optional)
}

export interface ToastInternal extends Required<ToastOptions> {
  id: string; // always present internally
  createdAt: number;
}
