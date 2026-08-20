import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ToastMessage from './ToastMessage'

test('renders toast message with correct text', () => {
  render(<ToastMessage message="Note Saved" type="success" onClose={() => {}} />)
  
  const messageElement = screen.getByText('Note Saved')
  expect(messageElement).toBeInTheDocument()
})