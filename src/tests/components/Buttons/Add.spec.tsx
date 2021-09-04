import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AddButton } from '../../../components/Buttons/Add';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const onClick = jest.fn();

describe('Add button Component', () => {
  it('renders correctly add button label', () => {
    render(
      <AddButton onClick={onClick} />
    )

    expect(screen.getByRole('button', {name: "Add"})).toBeInTheDocument()
    expect(onClick).toHaveBeenCalledTimes(0)
  })

  it('renders correctly add button label', async () => {
    render(
      <AddButton onClick={onClick} />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Add'}));
    })

    expect(screen.getByRole('button', {name: "Add"})).toBeInTheDocument()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})