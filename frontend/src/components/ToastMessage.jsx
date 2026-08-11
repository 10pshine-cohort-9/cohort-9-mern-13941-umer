import { useEffect } from 'react'
import './ToastMessage.css'

function ToastMessage({ message, type, onClose }) {
  useEffect(() => {
    if (message !== '') {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (message === '') {
    return null;
  }

  return (
    <div className={`my-toast ${type === 'error' ? 'toast-error' : 'toast-success'}`}>
      {message}
    </div>
  )
}

export default ToastMessage