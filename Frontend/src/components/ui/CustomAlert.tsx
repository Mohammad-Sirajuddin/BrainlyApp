import { useEffect } from 'react';

interface CustomAlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function CustomAlert({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 3000 
}: CustomAlertProps) {
  
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 text-slate-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-right duration-300">
      <div className={`
        ${getAlertStyles()}
        border-2 rounded-xl p-4 shadow-lg max-w-sm min-w-[300px]
        backdrop-blur-sm
      `}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{getIcon()}</span>
          <div className="flex-1">
            <p className="font-medium text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-current hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold transition-colors"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}