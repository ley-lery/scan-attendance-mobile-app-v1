type ToastType = "success" | "error" | "warning" | "info";
type ToastPosition = "top" | "bottom";

interface ToastOptions {
  type?: ToastType;
  title?: string;
  message?: string;
  duration?: number;
  position?: ToastPosition;
  id?: string;
}

interface ToastInternal extends Required<ToastOptions> {
  id: string;
  createdAt: number;
}

type HistoryType = {
  id: number;
  date_time: string;
  date: string;
  subject: string;
  time: string;
  room: string;
  status: string;
  color: string;
};
