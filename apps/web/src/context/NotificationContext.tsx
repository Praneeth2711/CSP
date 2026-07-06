import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface NotificationContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  const bgColors = {
    success: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30",
    warning: "bg-orange-50 border-orange-100 dark:bg-orange-950/20 dark:border-orange-900/30",
    error: "bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30",
    info: "bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30"
  };

  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      
      {/* Floating Toast Notification Containers */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-2 w-full max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-start p-4 rounded-2xl border shadow-lg glass transition-all duration-300 animate-in slide-in-from-top-4 ${bgColors[toast.type]}`}
          >
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {icons[toast.type]}
            </div>
            <div className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 ml-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
