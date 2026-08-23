import { useEffect, useState, useRef } from 'react'
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
  const [currentView, setCurrentView] = useState('all') 
  const [pinnedNotes, setPinnedNotes] = useState(JSON.parse(localStorage.getItem('pinnedNotes')) || [])
  const [profileData, setProfileData] = useState(null)

  const searchQueryRef = useRef('')
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    searchQueryRef.current = searchQuery
  }, [searchQuery])

  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      getAllNotes()
    }
  }, [navigate, token, searchQuery])

  useEffect(() => {
    if (currentView === 'profile' && !profileData && token) {
      axios.get('/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setProfileData(res.data))
        .catch(() => {
          setToastText('Could not load profile details')
          setToastType('error')
        })
    }
  }, [currentView, profileData, token])

  useEffect(() => {
    if (!token) return

    const socket = io('/', {
      auth: { token }
    })

    socket.on('notesChanged', () => {
      axios.get('/api/notes', { 
        params: { search: searchQueryRef.current },
        headers: { Authorization: `Bearer ${token}` } 
      })
      .then((res) => setNotesList(res.data))
    })

    return () => {
      socket.disconnect()
    }
  }, [token])

  const getAllNotes = () => {
    setIsLoading(true)
    axios.get('/api/notes', { 
      params: { search: searchQuery },
      headers: { Authorization: `Bearer ${token}` } 
    })
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

  const togglePin = (id) => {
    const newPins = pinnedNotes.includes(id) 
      ? pinnedNotes.filter(noteId => noteId !== id) 
      : [...pinnedNotes, id];
    setPinnedNotes(newPins);
    localStorage.setItem('pinnedNotes', JSON.stringify(newPins));
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

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
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
          getAllNotes()
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
        if (pinnedNotes.includes(currentNote.id)) {
          togglePin(currentNote.id);
        }
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

  const displayedNotes = currentView === 'pinned' 
    ? notesList.filter(note => pinnedNotes.includes(note.id)) 
    : notesList;

  const sortedNotes = [...displayedNotes].sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt || 0);
    const dateB = new Date(b.created_at || b.createdAt || 0);
    return dateB - dateA;
  });

  return (
    <div className="dashboard-layout">
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        handleExport={handleExport} 
        handleImportClick={handleImportClick} 
      />
      
      <input type="file" accept=".json" onChange={handleImport} ref={fileInputRef} style={{ display: 'none' }} />
      
      <div className="main-content">
        <ToastMessage message={toastText} type={toastType} onClose={() => setToastText('')} />
        
        {currentView === 'profile' ? (
          <div className="profile-wrapper">
            <div className="profile-card-centered">
              <div className="profile-header-center">
                <h2>User Profile</h2>
                <p>Manage your account settings</p>
              </div>
              
              {profileData ? (
                <div className="profile-details-list">
                  <div className="profile-row">
                    <span>Full Name</span>
                    <strong>{profileData.name}</strong>
                  </div>
                  <div className="profile-row">
                    <span>Email Address</span>
                    <strong>{profileData.email}</strong>
                  </div>
                  <div className="profile-row">
                    <span>Account ID</span>
                    <strong>{profileData.id}</strong>
                  </div>
                  <div className="profile-row">
                    <span>Total Notes</span>
                    <strong style={{color: '#6366f1', fontSize: '20px'}}>{notesList.length}</strong>
                  </div>
                </div>
              ) : (
                <div className="loading-state">Loading profile...</div>
              )}
            </div>
          </div>
        ) : (
          <div className="notes-page-section">
            <div className="top-search-bar">
              <div className="search-input-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  placeholder="Search your notes here..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="view-header">
              <h2>{currentView === 'pinned' ? 'Pinned Notes' : 'All Notes'}</h2>
            </div>
            
            {isLoading ? (
              <div className="loading-state">Loading your workspace...</div>
            ) : (
              <div className="notes-container">
                
                {currentView === 'all' && searchQuery.trim() === '' && notesList.length > 0 && (
                  <div className="add-note-card" onClick={openNewNoteModal}>
                    <div className="add-icon">+</div>
                    <p>Create new note</p>
                  </div>
                )}

                {sortedNotes.length === 0 ? (
                  <div className="empty-state-wrapper">
                    <div className="empty-state-premium">
                      <div className="empty-icon-circle">
                        {currentView === 'pinned' ? (
                          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.1 4.96a2.08 2.08 0 0 0-2.88 0l-1.92 1.92-5.71-1.39-1.94 1.94 3.75 5.56-6.17 6.17 1.41 1.42 6.17-6.17 5.56 3.75 1.94-1.94-1.39-5.71 1.92-1.92a2.08 2.08 0 0 0 0-2.88z"></path></svg>
                        ) : searchQuery.trim() !== '' ? (
                          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        ) : (
                          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        )}
                      </div>
                      <h3>
                        {searchQuery.trim() !== '' ? 'No matching notes' : (currentView === 'pinned' ? 'No pinned notes yet' : 'Your workspace is empty')}
                      </h3>
                      <p>
                        {searchQuery.trim() !== '' 
                          ? 'We couldn\'t find any notes matching your search keywords. Please try a different term.' 
                          : (currentView === 'pinned' 
                              ? 'You have not pinned any notes. Pin your important notes to access them quickly here.' 
                              : 'Start organizing your thoughts and tasks by creating your very first note right now.')}
                      </p>
                      
                      {searchQuery.trim() === '' && currentView === 'all' && (
                        <button className="empty-state-btn" onClick={openNewNoteModal}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                          Create First Note
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  sortedNotes.map((noteItem) => (
                    <NoteCard 
                      key={noteItem.id} 
                      note={noteItem} 
                      isPinned={pinnedNotes.includes(noteItem.id)}
                      onTogglePin={() => togglePin(noteItem.id)}
                      onEditClick={openEditNoteModal} 
                      onDeleteClick={openDeleteConfirm} 
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <NoteModal isOpen={showNoteModal} onClose={() => setShowNoteModal(false)} onSave={saveNoteToDb} selectedNote={currentNote} />
      <DeleteConfirm isOpen={showDeleteModal} onCancel={() => setShowDeleteModal(false)} onConfirm={deleteNoteFromDb} />
    </div>
  )
}

export default Dashboard