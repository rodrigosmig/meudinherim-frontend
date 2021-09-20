import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EditButton } from '../../../components/Buttons/Edit';

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

describe('Edit button Component', () => {
  it('renders correctly edit button label', () => {
    render(
      <EditButton href="/test" />
    )

    expect(screen.getByRole('button', {name: "Edit"})).toBeInTheDocument()    
  })
})