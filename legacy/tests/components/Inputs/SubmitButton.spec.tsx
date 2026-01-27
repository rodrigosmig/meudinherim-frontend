import { render, screen } from '@testing-library/react';
import { SubmitButton } from '../../../components/Buttons/Submit';

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

describe('SubmitButton Component', () => {
  it('renders correctly button label', () => {
    render(
      <SubmitButton label="Submit Test" />
    )

    expect(screen.getByText('Submit Test')).toBeInTheDocument()
  })
})