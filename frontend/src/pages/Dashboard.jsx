import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { io } from 'socket.io-client'
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
  const [searchQuery, setSearchQuery] = useState('')

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      getAllNotes()

     const socket = io('http://localhost:5000', {
        auth: { token }
      })

      socket.on('notesChanged', () => {
        axios.get(`/api/notes?search=${searchQuery}`, { headers: { Authorization: `Bearer ${token}` } })
          .then((res) => setNotesList(res.data))
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [navigate, token, searchQuery])

  const getAllNotes = () => {
    setIsLoading(true)
    axios.get(`/api/notes?search=${searchQuery}`, { headers: { Authorization: `Bearer ${token}` } })
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

  const handleExport = () => {
    axios.get('/api/notes/export', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data))
        const downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", "my_notes.json")
        document.body.appendChild(downloadAnchorNode)
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
      })
      .catch(() => {
        setToastText('Error exporting notes')
        setToastType('error')
      })
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result)
        axios.post('/api/notes/import', { notes: json }, { headers: { Authorization: `Bearer ${token}` } })
          .then(() => {
            setToastText('Notes Imported Successfully')
            setToastType('success')
            getAllNotes()
          })
          .catch(() => {
            setToastText('Error importing notes')
            setToastType('error')
          })
      } catch (err) {
        setToastText('Invalid JSON file')
        setToastType('error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const saveNoteToDb = (noteObj) => {
    if (currentNote !== null) {
      axios.put(`/api/notes/${currentNote.id}`, noteObj, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setToastText('Note Updated Successfully')
          setToastType('success')
          setShowNoteModal(false)
          getAllNotes() // Yahan add kiya
        })
        .catch(() => {
          setToastText('Error updating note')
          setToastType('error')
        })
    } else {
      axios.post('/api/notes', noteObj, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {
          setToastText('Note Created Successfully')
          setToastType('success')
          setShowNoteModal(false)
          getAllNotes() // Yahan add kiya
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
        getAllNotes() // Yahan add kiya
      })
      .catch(() => {
        setToastText('Error deleting note')
        setToastType('error')
      })
  }

  const openNewNoteModal = () => { 
    setCurrentNote(null)
    setShowNoteModal(true)
  }
  
  const openEditNoteModal = (note) => { 
    setCurrentNote(note)
    setShowNoteModal(true)
  }
  
  const openDeleteConfirm = (note) => { 
    setCurrentNote(note)
    setShowDeleteModal(true)
  }

  if (!token) return null

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
          <div className="action-buttons">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn-secondary" onClick={getAllNotes}>Search</button>
            <button className="btn-secondary" onClick={handleExport}>Export</button>
            <label className="btn-secondary import-label">
              Import
              <input type="file" accept=".json" onChange={handleImport} />
            </label>
            <button className="btn-add-new" onClick={openNewNoteModal}>
              + Add New Note
            </button>
          </div>
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