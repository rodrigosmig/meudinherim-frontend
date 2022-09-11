import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CancelPaymentButton } from '../../../components/Buttons/CancelPayment';

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
      <CancelPaymentButton onCancel={onClick} label={resource} loading={false} />
    )

    expect(onClick).toHaveBeenCalledTimes(0)
    expect(screen.getByRole('button', {name: "Cancel Payment"})).toBeInTheDocument()
  })

  it('renders alert confirmation correctly', async () => {
    render(
        <CancelPaymentButton onCancel={onClick} label={resource} loading={false} />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: "Cancel Payment"}));
    })

    expect(onClick).toHaveBeenCalledTimes(0)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
  });

  it('renders correctly cancel payment confirmation', async () => {
    render(
        <CancelPaymentButton onCancel={onClick} label={resource} loading={false} />
    )

    await waitFor(() => {
        fireEvent.click(screen.getByRole('button', {name: "Cancel Payment"}));
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Confirmar'}));
    })
    
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('tests loading label', async () => {
    render(
        <CancelPaymentButton onCancel={onClick} label={resource} loading={true} />
    )

    await waitFor(() => {
        fireEvent.click(screen.getByRole('button', {name: "Cancel Payment"}));
    })

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
})