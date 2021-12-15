import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AddButton } from '../../../components/Buttons/Add';
import { AnticipateButton } from '../../../components/Buttons/Anticipate';

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
  beforeEach(() => {
    render(
      <AnticipateButton onClick={onClick} />
    )
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly add button label', () => {
    expect(screen.getByRole('button', {name: "Antecipar"})).toBeInTheDocument()
    expect(onClick).toHaveBeenCalledTimes(0)
  })

  it('tests onClick function', async () => {
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Antecipar'}));
    })

    expect(screen.getByRole('button', {name: "Antecipar"})).toBeInTheDocument()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})