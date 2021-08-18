import { render, screen } from '@testing-library/react';
import { Card } from "../../components/Card"

describe('Card Component', () => {
  it('renders correctly', () => {
    render(
      <Card>
        <h1>Home</h1>
      </Card>
    )
  
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('renders correctly when there is title in card', () => {
    render(
      <Card title="Title Test">
        <h1>Home</h1>
      </Card>
    )
  
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Title Test')).toBeInTheDocument()
  })
})