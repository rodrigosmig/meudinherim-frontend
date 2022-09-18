import { fireEvent, render, screen } from "@testing-library/react";
import { EditCategoryForm } from "../../../../components/Foms/categories/EditCategoryForm";
import { act } from "react-dom/test-utils";
import { mocked } from "ts-jest/utils";
import { categoryService } from "../../../../services/ApiService/CategoryService";
import { ICategory } from "../../../../types/category";

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

const categoryServiceMocked = mocked(categoryService.update);

jest.mock('react-query');
jest.mock('../../../../services/ApiService/CategoryService');

const category: ICategory = {
  id: 1,
  type: 2,
  name: "Category Test",
  active: true,
  show_in_dashboard: true
}

const closeModal = jest.fn;

describe('EditCategoryForm Component', () => {
  beforeEach(() => {
    render(<EditCategoryForm category={category} onClose={closeModal} />)
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