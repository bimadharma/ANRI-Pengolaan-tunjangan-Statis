import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import type { ReactNode } from "react";

export interface Toast {
  id: number;
  type: "success" | "error" | "warning" | "info" | "loading";
  message?: string;
}

interface AlertNotificationProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

// Tambahkan util class spin lebih cepat
const fastSpin = "animate-[spin_0.6s_linear_infinite]";

export default function AlertNotification({
  toasts,
  removeToast,
}: AlertNotificationProps) {
  const styleMap: Record<Toast["type"], string> = {
    success: "bg-green-50 border-green-300 text-green-700 shadow-green-100",
    error: "bg-red-50 border-red-300 text-red-700 shadow-red-100",
    warning: "bg-amber-50 border-amber-300 text-amber-700 shadow-amber-100",
    info: "bg-blue-50 border-blue-300 text-blue-700 shadow-blue-100",
    loading: "bg-blue-50 border-blue-300 text-blue-700 shadow-blue-100",
  };

  const iconMap: Record<Toast["type"], ReactNode> = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    loading: <Loader2 className={`w-5 h-5 ${fastSpin}`} />, // spin lebih cepat
  };

  const defaultMessages: Record<Toast["type"], string> = {
    success: "Data berhasil diproses.",
    error: "Terjadi kesalahan. Data tidak dapat diproses.",
    warning: "Mohon lengkapi seluruh kolom yang diperlukan.",
    info: "Informasi terbaru berhasil dimuat.",
    loading: "Sedang memuat data, harap tunggu…",
  };

  return (
    <div className="fixed top-23 right-4 z-[60] flex flex-col gap-3 w-72">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 150, opacity: 0 }}
            transition={{
              duration: t.type === "loading" ? 0.15 : 0.25, // loading lebih cepat
              ease: "easeOut",
            }}
            className={`border rounded-2xl px-4 py-3 flex items-start gap-3 shadow-md ${styleMap[t.type]}`}
          >
            <div className="mt-0.5">{iconMap[t.type]}</div>

            <div className="flex-1 text-sm font-medium leading-snug">
              {t.message?.trim() ? t.message : defaultMessages[t.type]}
            </div>

            {t.type !== "loading" && (
              <button
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg hover:bg-black/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
