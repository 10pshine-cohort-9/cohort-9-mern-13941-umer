import './DeleteConfirm.css'

function DeleteConfirm({ isOpen, onCancel, onConfirm }) {
  if (isOpen === false) {
    return null;
  }

  return (
    <div className="delete-modal-bg">
        
      <div className="delete-modal-box">
        
        <h3>Delete Note?</h3>
        <p>Are you sure you want to delete this note?</p>

        <div className="delete-buttons">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>

      </div>
    </div>
  )
}

export default DeleteConfirm