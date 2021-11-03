import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from '../../../components/Inputs/Input';

describe('Input Component', () => {
  it('renders correctly input label', () => {
    render(
      <Input name="test" type="text" label="Test" />
    )
  
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('onChange fires', () => {
    const changeHandler = jest.fn();
    
    render(
      <Input onChange={changeHandler} name="test" />
    )
    
    fireEvent.change(screen.getByRole('textbox'), {target: { value: 10}})
    fireEvent.change(screen.getByRole('textbox'), {target: { value: 100}})

    expect(changeHandler).toHaveBeenCalledTimes(2)
  })
})