import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import NoteCard from './NoteCard'

test('renders note card with title', () => {
  const dummyNote = {
    id: 1,
    title: 'Internship Test Note',
    content: 'This is just a basic tesing note created by devloepr umer',
    created_at: '2026-08-20T10:00:00.000Z'
  }
  
  render(<NoteCard note={dummyNote} onEditClick={() => {}} onDeleteClick={() => {}} />)
  
  const titleElement = screen.getByText('Internship Test Note')
  expect(titleElement).toBeInTheDocument()
})