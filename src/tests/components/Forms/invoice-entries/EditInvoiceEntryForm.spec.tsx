import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { EditInvoiceEntryForm } from "../../../../components/Foms/InvoiceEntry/EditInvoiceEntryForm";
import { useCardsForm } from "../../../../hooks/useCards";
import { useSelector } from "../../../../hooks/useSelector";
import { invoiceEntriesService } from "../../../../services/ApiService/InvoiceEntriesService";
import { IInvoiceEntry } from "../../../../types/invoiceEntry";

jest.mock('@chakra-ui/react', () => {
  const toast = jest.requireActual('@chakra-ui/react');
  return {
    ...toast,
    createStandaloneToast: () => jest.fn,
  };
});

const invoiceEntriesServiceMocked = mocked(invoiceEntriesService.update);
const useCardsFormMocked = useCardsForm as jest.Mock<any>;
const useSelectorMock = mocked(useSelector)

jest.mock('react-query')
jest.mock('../../../../services/ApiService/InvoiceEntriesService')
jest.mock('../../../../hooks/useCards')
jest.mock('../../../../hooks/useSelector');


const onClose = jest.fn();

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
    value: 1,
    label: "Card Test 1"
  },
  {
    value: 2,
    label: "Card Test 2"
  }
]

const entry: IInvoiceEntry = {
  id: 1,
  date: "2021-10-21",
  description: "Invoice Entry Test",
  value: 100,
  category: {
    id: 1,
    type: 1,
    name: "Category Test",
    active: true,
    show_in_dashboard: true
  },
  card_id: 1,
  invoice_id: 1,
  is_parcel: false,
  parcel_number: null,
  parcel_total: null,
  total_purchase: null,
  parcelable_id: null,
  anticipated: false,
}

describe('EditInvoiceEntryForm Component', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation(() => ({ isLoading: false, categoriesForm: categories }));
    useCardsFormMocked.mockImplementation(() => ({ isLoading: false, data: formCards }));

    render(<EditInvoiceEntryForm entry={entry} onClose={onClose} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(0);

    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();

    expect(screen.getByText("Income Category Test")).toBeInTheDocument();
    expect(screen.getByText("Expense Category Test")).toBeInTheDocument();
  })

  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Valor'), {target: { value: "" }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })
    
    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo categoria é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo descrição é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo valor é obrigatório")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "2" }})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: -100}})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: 'Te'}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo descrição deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
    
  })

  it('tests installments', async () => {
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(1);
  })
})