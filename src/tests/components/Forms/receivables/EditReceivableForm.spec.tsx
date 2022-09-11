import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { EditReceivableForm } from "../../../../components/Foms/receivable/EditReceivableForm";
import { useCategoriesForm } from "../../../../hooks/useCategories";
import { receivableService } from "../../../../services/ApiService/ReceivableService";
import { IReceivable } from "../../../../types/receivable";

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

jest.mock('@chakra-ui/react', () => {
  const toast = jest.requireActual('@chakra-ui/react');
  return {
    ...toast,
    createStandaloneToast: () => jest.fn,
  };
});

const receivableServiceMocked = mocked(receivableService.update);
const useCategoriesFormMocked = useCategoriesForm as jest.Mock<any>;

jest.mock('react-query')
jest.mock('../../../../services/ApiService/ReceivableService')
jest.mock('../../../../hooks/useCategories')

const categories = {
  income: [
    {
      id: 1,
      label: "Income Category"
    }
  ],
  expense: [
    {
      id: 2,
      label: "Expense Category"
    }
  ]
}

const receivable: IReceivable = {
    id: 1,
    due_date: "2021-10-21",
    paid_date: null,
    description: "Receivable test",
    value: 150.50,
    category: {
        id: 1,
        type: 1,
        name: "Category Test"
    },
    invoice: null,
    paid: false,
    monthly: false,
    has_parcels: false,
    is_parcel: false,
    total_purchase: null,
    parcel_number: null,
    parcelable_id: null,
  }

const closeModal = jest.fn;
const refetch = jest.fn;

describe('EditPayableForm Component', () => {
  beforeEach(() => {
    useCategoriesFormMocked.mockImplementation(() => ({ isLoading: false, data: categories }));
    render(<EditReceivableForm receivable={receivable} onClose={closeModal} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(receivableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("Vencimento")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    expect(screen.getByLabelText("Mensal")).toBeInTheDocument();
    //Categories
    expect(screen.getByRole("option", {name: "Income Category"})).toBeInTheDocument();
  })

  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Vencimento'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 0 }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(receivableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo vencimento é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo categoria é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo descrição é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "2" }})
    fireEvent.input(screen.getByLabelText('Vencimento'), {target: { value: '01/09/2021'}})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 0}})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: 'Te'}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(receivableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo descrição deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('update payable successfully', async () => {
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(receivableServiceMocked).toHaveBeenCalledTimes(1);
    //expect(screen.getByText("Conta a Receber alterada com sucesso")).toBeInTheDocument();
  })
})