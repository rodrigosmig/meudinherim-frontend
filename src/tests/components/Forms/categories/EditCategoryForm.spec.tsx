import { fireEvent, render, screen } from "@testing-library/react";
import { EditCategoryForm } from "../../../../components/Foms/categories/EditCategoryForm";
import { act } from "react-dom/test-utils";
import { mocked } from "ts-jest/utils";
import { categoryService } from "../../../../services/ApiService/CategoryService";

const categoryServiceMocked = mocked(categoryService.update);

jest.mock('react-query');
jest.mock('../../../../services/ApiService/CategoryService');

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

const closeModal = jest.fn;
const refetch = jest.fn;

describe('EditCategoryForm Component', () => {
  beforeEach(() => {
    render(<EditCategoryForm category={category} closeModal={closeModal} refetch={refetch} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: "" } })

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: ''}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(categoryServiceMocked).toBeCalledTimes(0);
    expect(screen.getByText("O campo tipo é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: 'Te'}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(categoryServiceMocked).toBeCalledTimes(0);
    expect(screen.getByText("O campo nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
  })

  it('edit category successfuly', async () => {
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: 1 } })

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: 'Category Test'}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(categoryServiceMocked).toBeCalledTimes(1);
    expect(screen.getByText("Categoria alterada com sucesso")).toBeInTheDocument();
  })
})