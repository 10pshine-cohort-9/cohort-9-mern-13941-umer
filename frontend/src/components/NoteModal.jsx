import { useState, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import './NoteModal.css'

function NoteModal({ isOpen, onClose, onSave, selectedNote }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const modalRef = useRef(null)
  const titleInputRef = useRef(null)
  const previouslyFocused = useRef(null)

  useEffect(() => {
    if (selectedNote !== null) {
      setTitle(selectedNote.title)
      setContent(selectedNote.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [selectedNote, isOpen])

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement;
    titleInputRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
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
  }, [isOpen, onClose]);

  if (isOpen === false) {
    return null;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave({ title: title, content: content });
  }

  return (
    <div className="form-modal-bg">
      <div className="form-modal-box" role="dialog" aria-modal="true" aria-labelledby="note-modal-title" ref={modalRef}>
        <h2 id="note-modal-title">{selectedNote ? 'Update Note' : 'Add New Note'}</h2>
        
        <form onSubmit={handleFormSubmit}>
          <div className="input-box">
            <label>Note Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required ref={titleInputRef} />
          </div>
          
          <div className="input-box">
            <label>Note Details:</label>
            <div className="quill-box">
              <ReactQuill theme="snow" value={content} onChange={setContent} />
            </div>
          </div>
          
          <div className="form-buttons">
            <button type="button" className="btn-close" onClick={onClose}>Close</button>
            <button type="submit" className="btn-submit">Save Note</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NoteModal