import DOMPurify from 'dompurify'
import './NoteCard.css'

function NoteCard({ note, onEditClick, onDeleteClick }) {
  const dateValue = note.created_at || note.createdAt;
  const dateStr = dateValue ? new Date(dateValue).toLocaleDateString() : '';
  const cleanContent = DOMPurify.sanitize(note.content)

  return (
    <div className="single-note-card">
      <div className="note-card-top">
        <h3>{note.title}</h3>
        <small>{dateStr}</small>
      </div>

      <div
        className="note-card-body"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />

      <div className="note-card-bottom">
        <button className="btn-edit" onClick={() => onEditClick(note)}>Edit</button>
        <button className="btn-delete" onClick={() => onDeleteClick(note)}>Delete</button>
      </div>
    </div>
  )
}

export default NoteCard