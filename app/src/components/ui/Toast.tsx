import { useEffect, useState } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} ${isVisible ? 'toast-visible' : 'toast-hidden'}`}>
      <span className="toast-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && 'ℹ'}
      </span>
      <span className="toast-message">{message}</span>
    </div>
  );
}

// Toast manager component
interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

let toastQueue: ToastItem[] = [];
let notifyListeners: (() => void)[] = [];

export const toast = {
  success: (message: string) => {
    addToast({ id: Date.now().toString(), message, type: 'success' });
  },
  error: (message: string) => {
    addToast({ id: Date.now().toString(), message, type: 'error' });
  },
  info: (message: string) => {
    addToast({ id: Date.now().toString(), message, type: 'info' });
  }
};

function addToast(item: ToastItem) {
  toastQueue = [...toastQueue, item];
  notifyListeners.forEach(fn => fn());
}

function removeToast(id: string) {
  toastQueue = toastQueue.filter(t => t.id !== id);
  notifyListeners.forEach(fn => fn());
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener = () => setToasts([...toastQueue]);
    notifyListeners.push(listener);
    return () => {
      notifyListeners = notifyListeners.filter(fn => fn !== listener);
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(item => (
        <Toast
          key={item.id}
          message={item.message}
          type={item.type}
          onClose={() => removeToast(item.id)}
        />
      ))}
    </div>
  );
}
