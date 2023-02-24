import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { act } from "react-dom/test-utils";
import { CreateCategoryForm } from "../../../../components/Foms/categories/CreateCategoryForm";
import { categoryService } from "../../../../services/ApiService/CategoryService";
import { renderWithProviders } from "../../../../utils/test-utils";
import store from '../../../../store/createStore';

const dispatchMock = mocked(store.dispatch)

jest.mock("../../../../store/createStore");
jest.mock('broadcast-channel');

jest.mock('react-query');
jest.mock('../../../../services/ApiService/CategoryService');

const onClose = jest.fn();

describe('CreateCategoryForm Component', () => {
  beforeEach(() => {
    renderWithProviders(<CreateCategoryForm onClose={onClose} />, {store})
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.clearAllMocks();
  });
  
  it('renders corretly', async () => {
    expect(dispatchMock).not.toBeCalled();
    expect(onClose).not.toBeCalled();

    expect(screen.getByText("Selecione um tipo")).toBeInTheDocument();
    expect(screen.getByText("Nome da Categoria")).toBeInTheDocument();
  })

  it('validates required fields inputs', async () => {
    fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    
    await waitFor(() => {
      expect(dispatchMock).not.toBeCalled();
      expect(onClose).not.toBeCalled();
      expect(screen.getByText("O campo tipo é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
    })
  })

  it('validates user inputs', async () => {
    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: 'Te'}
    })
    
    fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));

    await waitFor(() => {
      expect(dispatchMock).not.toBeCalled();
      expect(onClose).not.toBeCalled();
      expect(screen.getByText("O campo nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    })
  })

  it('create category successfuly', async () => {
    dispatchMock.mockReturnValue({unwrap: () => Promise.resolve()})
    
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: 1 } })

    const category_name = 'Category Test';

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: category_name}
    })

    fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));

    await waitFor(() => {
      expect(dispatchMock).toBeCalled();
      expect(onClose).toBeCalled();
      //expect(screen.getByText(`Categoria ${category_name} criada com sucesso`)).toBeInTheDocument();
    })
  })

  it('failed when create category', async () => {
    const response = {
      response: {
        status: 422,
        headers: {},
        statusText: "",
        config: {},
        data:{
          name: ["invalid name"],
        }
      }      
    }

    dispatchMock.mockReturnValue({unwrap: () => Promise.reject(response)})
    
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: 1 } })

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: 'Category Test'}
    })

    fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));

    await waitFor(() => {
      expect(dispatchMock).toBeCalled();
      expect(onClose).not.toBeCalled();
      expect(screen.getByText(response.response.data.name[0])).toBeInTheDocument();
    })
  })
})