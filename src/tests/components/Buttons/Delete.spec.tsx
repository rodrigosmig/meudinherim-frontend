import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AddButton } from '../../../components/Buttons/Add';
import { DeleteButton } from '../../../components/Buttons/Delete';

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

describe('Delete button Component', () => {
  it('renders correctly delete button label', () => {
    

    render(
      <DeleteButton onDelete={onClick} resource={resource} loading={false} />
    )

    expect(onClick).toHaveBeenCalledTimes(0)
    expect(screen.getByRole('button', {name: "Delete"})).toBeInTheDocument()
  })

  it('renders alert confirmation correctly', async () => {
    render(
      <DeleteButton onDelete={onClick} resource={resource} loading={false} />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
    })

    expect(onClick).toHaveBeenCalledTimes(0)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
  });

  it('renders correctly delete confirmation', async () => {
    render(
      <DeleteButton onDelete={onClick} resource={resource} loading={false} />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
    })

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Deletar'}));
    })
    
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('tests loading label', async () => {
    render(
      <DeleteButton onDelete={onClick} resource={resource} loading={true} />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
    })

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
})