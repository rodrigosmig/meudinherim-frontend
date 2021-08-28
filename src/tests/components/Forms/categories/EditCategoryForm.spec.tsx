import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { useMutation } from "react-query";
import { EditCategoryForm } from "../../../../components/Foms/EditCategoryForm";
import { act } from "react-dom/test-utils";

const useMutationMocked = useMutation as jest.Mock<any>;

jest.mock('react-query')

interface Category {
  id: number;
  type: 1 | 2;
  name: string;
}

const category: Category = {
  id: 1,
  type: 2,
  name: "Category Test"
}

describe('EditCategoryForm Component', () => {
  beforeEach(() => {
    useMutationMocked.mockImplementation(() => ({ isLoading: false }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validates required fields inputs', async () => {
    render(<EditCategoryForm category={category} />)

    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: "" } })

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: ''}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(useMutationMocked).toBeCalledTimes(2);
    expect(screen.getByText("O campo tipo é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    render(<EditCategoryForm category={category} />)

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: 'Te'}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(useMutationMocked).toBeCalledTimes(2);
    expect(screen.getByText("O campo nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
  })

  it('edit category successfuly', async () => {
    useMutationMocked.mockImplementation(() => ({ isLoading: true }));

    render(<EditCategoryForm category={category} />)

    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: 1 } })

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: 'Category Test'}
    })

    expect(useMutationMocked).toBeCalledTimes(1);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  })
})