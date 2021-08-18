import { render, screen } from '@testing-library/react';
import { Input } from '../../../components/Inputs/Input';

describe('Input Component', () => {
  it('renders correctly input label', () => {
    render(
      <Input name="test" type="text" label="Test" />
    )
  
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})