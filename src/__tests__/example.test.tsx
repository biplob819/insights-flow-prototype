import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple test to verify Jest setup
describe('Example Test', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true)
  })

  it('should render a simple component', () => {
    const TestComponent = () => <div>Test Component</div>
    render(<TestComponent />)
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })
})
