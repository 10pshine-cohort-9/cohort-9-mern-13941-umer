import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import './NoteModal.css'

function NoteModal({ isOpen, onClose, onSave, selectedNote }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (selectedNote !== null) {
      setTitle(selectedNote.title)
      setContent(selectedNote.content)
    } else {
      setTitle('')
      setContent('')
    }
  }, [selectedNote, isOpen])

  if (isOpen === false) {
    return null;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave({ title: title, content: content });
  }

  return (
    <div className="form-modal-bg">
      <div className="form-modal-box">
        <h2>{selectedNote ? 'Update Note' : 'Add New Note'}</h2>
        
        <form onSubmit={handleFormSubmit}>
          <div className="input-box">
            <label>Note Title:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required 
            />
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