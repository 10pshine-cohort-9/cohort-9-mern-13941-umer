import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import NoteModal from '../components/NoteModal'
import DeleteConfirm from '../components/DeleteConfirm'
import ToastMessage from '../components/ToastMessage'
import './Dashboard.css'

function Dashboard() {
  const [notesList, setNotesList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentNote, setCurrentNote] = useState(null)
  const [toastText, setToastText] = useState('')
  const [toastType, setToastType] = useState('success')

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
    } 
    else {
      getAllNotes()
    }
  }, [navigate, token])

  const getAllNotes = () => {
    setIsLoading(true)
    axios.get('/api/notes', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setNotesList(res.data)
        setIsLoading(false)
      })
      .catch(() => {
        setToastText('Could not load notes')
        setToastType('error')
        setIsLoading(false)
      })
  }

  const saveNoteToDb = (noteObj) => {
    if (currentNote !== null) {
      axios.put(`/api/notes/${currentNote.id}`, noteObj, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setToastText('Note Updated Successfully')
          setToastType('success')
          setShowNoteModal(false)
          getAllNotes()
        })
        .catch(() => {
          setToastText('Error updating note')
          setToastType('error')
        })
    } 
    
    else {
      axios.post('/api/notes', noteObj, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setToastText('Note Created Successfully')
          setToastType('success')
          setShowNoteModal(false)
          getAllNotes()
        })
        .catch(() => {
          setToastText('Error creating note')
          setToastType('error')
        })
    }
  }

  const deleteNoteFromDb = () => {
    axios.delete(`/api/notes/${currentNote.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setToastText('Note Deleted Successfully')
        setToastType('success')
        setShowDeleteModal(false)
        getAllNotes()
      })
      .catch(() => {
        setToastText('Error deleting note')
        setToastType('error')
      })
  }

  const openNewNoteModal = () => { 
    setCurrentNote(null); 
    setShowNoteModal(true); 
  }
  
  const openEditNoteModal = (note) => { 
    setCurrentNote(note); 
    setShowNoteModal(true); 
  }
  
  const openDeleteConfirm = (note) => { 
    setCurrentNote(note); 
    setShowDeleteModal(true); 
  }

  if (!token) return null;

  return (
    <div className="main-dashboard-page">
      <Navbar />
      
      <ToastMessage 
        message={toastText} 
        type={toastType} 
        onClose={() => setToastText('')} 
      />
      
      <div className="dashboard-content">
        <div className="top-bar">
          <h2>My Dashboard</h2>
          <button className="btn-add-new" onClick={openNewNoteModal}>
            + Add New Note
          </button>
        </div>
        
        {isLoading ? (
          <p>Loading your notes...</p>
        ) : (
          <div className="notes-container">
            {notesList.length === 0 ? (
              <p>No notes found. Create your first note!</p>
            ) : (
              notesList.map((noteItem) => (
                <NoteCard 
                  key={noteItem.id} 
                  note={noteItem} 
                  onEditClick={openEditNoteModal} 
                  onDeleteClick={openDeleteConfirm} 
                />
              ))
            )}
          </div>
        )}
      </div>

      <NoteModal 
        isOpen={showNoteModal} 
        onClose={() => setShowNoteModal(false)} 
        onSave={saveNoteToDb}
        selectedNote={currentNote}
      />

      <DeleteConfirm 
        isOpen={showDeleteModal} 
        onCancel={() => setShowDeleteModal(false)} 
        onConfirm={deleteNoteFromDb} 
      />
    </div>
  )
}

export default Dashboard