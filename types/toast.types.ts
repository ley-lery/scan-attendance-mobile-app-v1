// app/components/toast/toast.types.ts
export type ToastType = "success" | "error" | "warning";
export type ToastPosition = "top" | "bottom";

export interface ToastOptions {
  type?: ToastType;
  title?: string;
  message?: string;
  duration?: number;
  position?: ToastPosition;
  animationIcon?: boolean;
  id?: string;
}

export interface ToastInternal extends Required<ToastOptions> {
  id: string;
  createdAt: number;
}
