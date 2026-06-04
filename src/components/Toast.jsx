import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: {
      bg: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400" />
    },
    error: {
      bg: 'bg-rose-950/90 border-rose-500/30 text-rose-200',
      icon: <XCircle className="w-5 h-5 text-rose-400" />
    },
    info: {
      bg: 'bg-slate-900/90 border-indigo-500/30 text-indigo-200',
      icon: <Info className="w-5 h-5 text-indigo-400" />
    }
  };

  const currentStyle = styles[type] || styles.success;

  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-slide-in transition-all duration-300 z-50 ${currentStyle.bg}`}
      role="alert"
    >
      {currentStyle.icon}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="p-0.5 hover:bg-white/10 rounded transition-colors ml-2"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 opacity-75 hover:opacity-100" />
      </button>
    </div>
  );
};

export default Toast;
