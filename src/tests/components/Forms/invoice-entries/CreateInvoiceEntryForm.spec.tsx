import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { CreateInvoiceEntryForm } from "../../../../components/Foms/InvoiceEntry/CreateInvoiceEntryForm";
import { useCardsForm } from "../../../../hooks/useCards";
import { useCategoriesForm } from "../../../../hooks/useCategories";
import { invoiceEntriesService } from "../../../../services/ApiService/InvoiceEntriesService";

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

const invoiceEntriesServiceMocked = mocked(invoiceEntriesService.create);
const useCategoriesFormMocked = useCategoriesForm as jest.Mock<any>;
const useCardsFormMocked = useCardsForm as jest.Mock<any>;

jest.mock('react-query')
jest.mock('../../../../services/ApiService/InvoiceEntriesService')
jest.mock('../../../../hooks/useCards')
jest.mock('../../../../hooks/useCategories')

const onCancel = jest.fn();
const refetch = jest.fn();

const categories = {
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

const formCards = [
  {
    value: "1",
    label: "Card Test 1"
  },
  {
    value: "2",
    label: "Card Test 2"
  }
]

describe('CreateInvoiceEntryForm Component', () => {
  beforeEach(() => {
    useCategoriesFormMocked.mockImplementation(() => ({ isLoading: false, data: categories }));
    useCardsFormMocked.mockImplementation(() => ({ isLoading: false, data: formCards }));

    render(<CreateInvoiceEntryForm onCancel={onCancel} refetch={refetch} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(0);

    expect(screen.getByText("Cart??o de Cr??dito")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descri????o")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();

    expect(screen.getByText("Income Category Test")).toBeInTheDocument();
    expect(screen.getByText("Expense Category Test")).toBeInTheDocument();
  })

   it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByLabelText('Cart??o de Cr??dito'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Data'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Valor'), {target: { value: 0 }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo cart??o de cr??dito ?? inv??lido")).toBeInTheDocument();
    expect(screen.getByText("O campo data ?? obrigat??rio")).toBeInTheDocument();
    expect(screen.getByText("O campo categoria ?? inv??lido")).toBeInTheDocument();
    expect(screen.getByText("O campo descri????o ?? obrigat??rio")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.input(screen.getByLabelText('Cart??o de Cr??dito'), {target: { value: "1" }})
    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "2" }})
    fireEvent.input(screen.getByLabelText('Data'), {target: { value: '01/09/2021'}})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: -100}})
    fireEvent.input(screen.getByLabelText('Descri????o'), {target: {value: 'Te'}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo descri????o deve ter no m??nimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
    
  })

  it('tests installments', async () => {
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 100}})
    
    await waitFor(() => {
        fireEvent.click(screen.getByLabelText("Parcelar"));
    })
    
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByLabelText("Parcelar")).not.toBeDisabled();
    expect(screen.getByText("Numero de parcelas")).toBeInTheDocument();
    expect(screen.getByText("Valor da Parcela:")).toBeInTheDocument();    
  })
})