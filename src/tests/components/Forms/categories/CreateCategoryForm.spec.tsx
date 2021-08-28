import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { useMutation } from "react-query";
import { act } from "react-dom/test-utils";
import { CreateCategoryForm } from "../../../../components/Foms/CreateCategoryForm";

const useMutationMocked = useMutation as jest.Mock<any>;

jest.mock('react-query')

describe('EditCategoryForm Component', () => {
  beforeEach(() => {
    useMutationMocked.mockImplementation(() => ({ isLoading: false }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders corretly', async () => {
    render(<CreateCategoryForm />)

    expect(screen.getByText("Selecione um tipo")).toBeInTheDocument();
    expect(screen.getByText("Nome da Categoria")).toBeInTheDocument();
  })

  it('validates required fields inputs', async () => {
    render(<CreateCategoryForm />)

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(useMutationMocked).toBeCalledTimes(2);
    expect(screen.getByText("O campo tipo é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    render(<CreateCategoryForm />)

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: 'Te'}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(useMutationMocked).toBeCalledTimes(2);
    expect(screen.getByText("O campo nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
  })

  it('create category successfuly', async () => {
    useMutationMocked.mockImplementation(() => ({ isLoading: true }));

    render(<CreateCategoryForm />)

    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: 1 } })

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: 'Category Test'}
    })

    expect(useMutationMocked).toBeCalledTimes(1);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  })
})