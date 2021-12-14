import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { act } from "react-dom/test-utils";
import { CreateCategoryForm } from "../../../../components/Foms/categories/CreateCategoryForm";
import { categoryService } from "../../../../services/ApiService/CategoryService";

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

const categoryServiceMocked = mocked(categoryService.create);

jest.mock('react-query');
jest.mock('../../../../services/ApiService/CategoryService');

const closeModal = jest.fn;
const refetch = jest.fn;

describe('CreateCategoryForm Component', () => {
  beforeEach(() => {
    render(<CreateCategoryForm closeModal={closeModal} refetch={refetch} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders corretly', async () => {
    expect(categoryServiceMocked).toBeCalledTimes(0);
    expect(screen.getByText("Selecione um tipo")).toBeInTheDocument();
    expect(screen.getByText("Nome da Categoria")).toBeInTheDocument();
  })

  it('validates required fields inputs', async () => {
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

  it('create category successfuly', async () => {
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: 1 } })

    const category_name = 'Category Test';

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: category_name}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(categoryServiceMocked).toBeCalledTimes(1);
    expect(screen.getByText(`Categoria ${category_name} criada com sucesso`)).toBeInTheDocument();
  })
})