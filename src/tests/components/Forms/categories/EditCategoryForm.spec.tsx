import { fireEvent, screen, waitFor } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { EditCategoryForm } from "../../../../components/Foms/categories/EditCategoryForm";
import store from '../../../../store/createStore';
import { ICategory } from "../../../../types/category";
import { renderWithProviders } from "../../../../utils/test-utils";

const dispatchMock = mocked(store.dispatch)

jest.mock("../../../../store/createStore");
jest.mock('broadcast-channel');

const category: ICategory = {
  id: 1,
  type: 2,
  name: "Category Test",
  active: true,
  show_in_dashboard: true
}

const onClose = jest.fn();

describe('EditCategoryForm Component', () => {
  beforeEach(() => {
    renderWithProviders(<EditCategoryForm category={category} onClose={onClose} />, {store})
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: "" } })

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: ''}
    })

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

  it('edit category successfuly', async () => {
    dispatchMock.mockReturnValue({unwrap: () => Promise.resolve()})
    
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: 1 } })

    fireEvent.input(screen.getByLabelText('Nome da Categoria'), {
      target: {value: 'Category Test'}
    })

    fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    
    await waitFor(() => {
      expect(dispatchMock).toBeCalled();
      expect(onClose).toBeCalled();
      expect(screen.getByText("Categoria alterada com sucesso")).toBeInTheDocument();
    })
  })

  it('failed when edit category', async () => {
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