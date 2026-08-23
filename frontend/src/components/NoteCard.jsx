import DOMPurify from 'dompurify'
import './NoteCard.css'

function NoteCard({ note, isPinned, onTogglePin, onEditClick, onDeleteClick }) {
  const dateValue = note.created_at || note.createdAt;
  const dateStr = dateValue ? new Date(dateValue).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const cleanContent = DOMPurify.sanitize(note.content)

  const pastelColors = ['#fef3c7', '#dbeafe', '#dcfce3', '#fce7f3', '#f3e8ff'];
  const cardBgColor = pastelColors[note.id % pastelColors.length] || pastelColors[0];

  return (
    <div className="single-note-card" style={{ backgroundColor: cardBgColor }}>
      <div className="note-card-top">
        <h3>{note.title}</h3>
        <button 
          className={`pin-btn ${isPinned ? 'active-pin' : ''}`} 
          onClick={onTogglePin} 
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.1 4.96a2.08 2.08 0 0 0-2.88 0l-1.92 1.92-5.71-1.39-1.94 1.94 3.75 5.56-6.17 6.17 1.41 1.42 6.17-6.17 5.56 3.75 1.94-1.94-1.39-5.71 1.92-1.92a2.08 2.08 0 0 0 0-2.88z"></path></svg>
        </button>
      </div>
      
      <span className="note-date">{dateStr}</span>

      <div
        className="note-card-body"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />

      <div className="note-card-bottom">
        <button className="btn-edit" onClick={() => onEditClick(note)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDeleteClick(note)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default NoteCard