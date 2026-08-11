import { useEffect, useRef } from 'react'
import './DeleteConfirm.css'

function DeleteConfirm({ isOpen, onCancel, onConfirm }) {
  const modalRef = useRef(null)
  const cancelBtnRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement;
    cancelBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('button');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onCancel]);

  if (isOpen === false) {
    return null;
  }

  return (
    <div className="delete-modal-bg">
        
      <div className="delete-modal-box" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" ref={modalRef}>
        
        <h3 id="delete-modal-title">Delete Note?</h3>
        <p>Are you sure you want to delete this note?</p>

        <div className="delete-buttons">
          <button className="btn-cancel" onClick={onCancel} ref={cancelBtnRef}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>

      </div>
    </div>
  )
}

export default DeleteConfirm