import { useState } from 'react';

interface AlertState {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
}

export function useAlert() {
  const [alert, setAlert] = useState<AlertState>({
    message: '',
    type: 'info',
    isVisible: false
  });

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlert({
      message,
      type,
      isVisible: true
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return {
    alert,
    showAlert,
    hideAlert
  };
}