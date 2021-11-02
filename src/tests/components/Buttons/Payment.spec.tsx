import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CancelPaymentButton } from '../../../components/Buttons/CancelPayment';
import { PaymentButton } from '../../../components/Buttons/Payment';

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
const resource = "button test";

describe('Cancel Payment button Component', () => {
  it('renders correctly delete button label', () => {
    render(
      <PaymentButton onClick={onClick} />
    )

    expect(onClick).toHaveBeenCalledTimes(0)
    expect(screen.getByRole('button', {name: "Pay"})).toBeInTheDocument()
  })

  it('renders alert confirmation correctly', async () => {
    render(
        <PaymentButton onClick={onClick} />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: "Pay"}));
    })

    expect(onClick).toHaveBeenCalledTimes(1)
  });
})