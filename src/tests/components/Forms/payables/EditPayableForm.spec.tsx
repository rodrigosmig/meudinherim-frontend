import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { EditPayableForm } from "../../../../components/Foms/payable/EditPayableForm";
import { useSelector } from "../../../../hooks/useSelector";
import { payableService } from "../../../../services/ApiService/PayableService";
import { IPayable } from "../../../../types/payable";

jest.mock('@chakra-ui/react', () => {
  const toast = jest.requireActual('@chakra-ui/react');
  return {
    ...toast,
    createStandaloneToast: () => jest.fn,
  };
});

const payableServiceMocked = mocked(payableService.update);
const useSelectorMock = mocked(useSelector)

jest.mock('react-query')
jest.mock('../../../../services/ApiService/PayableService')
jest.mock('../../../../hooks/useSelector');

const categoriesForm = {
  income: [
    {
      id: 1, label: "Income Category Test"
    },
  ],
  expense: [
    {
      id: 2, label: "Expense Category Test"
    },
  ],
}

const payable: IPayable = {
  id: 1,
  due_date: "2021-10-21",
  paid_date: null,
  description: "Payable test",
  value: 150.50,
  category: {
      id: 1,
      name: "Category Test",
      type: 2
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

const closeModal = jest.fn();

describe('EditPayableForm Component', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation(() => ({ isLoading: false, categoriesForm: categoriesForm }));

    render(<EditPayableForm payable={payable} onClose={closeModal} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("Vencimento")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    expect(screen.getByLabelText("Mensal")).toBeInTheDocument();
    //Categories
    expect(screen.getByRole("option", {name: "Expense Category Test"})).toBeInTheDocument();
  })

  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Vencimento'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 0 }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
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

    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(closeModal).not.toHaveBeenCalled();
    expect(screen.getByText("O campo descrição deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('update payable successfully', async () => {
    fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    
    await waitFor(() => {
      expect(payableServiceMocked).toHaveBeenCalledTimes(1);
    })

  })
})