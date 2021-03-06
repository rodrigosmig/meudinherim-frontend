import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { EditInvoiceEntryForm } from "../../../../components/Foms/InvoiceEntry/EditInvoiceEntryForm";
import { useCardsForm } from "../../../../hooks/useCards";
import { useCategoriesForm } from "../../../../hooks/useCategories";
import { invoiceEntriesService } from "../../../../services/ApiService/InvoiceEntriesService";
import { IInvoiceEntry } from "../../../../types/invoiceEntry";

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

const invoiceEntriesServiceMocked = mocked(invoiceEntriesService.update);
const useCategoriesFormMocked = useCategoriesForm as jest.Mock<any>;
const useCardsFormMocked = useCardsForm as jest.Mock<any>;

jest.mock('react-query')
jest.mock('../../../../services/ApiService/InvoiceEntriesService')
jest.mock('../../../../hooks/useCards')
jest.mock('../../../../hooks/useCategories')

const onClose = jest.fn();
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
    name: "Category Test"
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
    useCategoriesFormMocked.mockImplementation(() => ({ isLoading: false, data: categories }));
    useCardsFormMocked.mockImplementation(() => ({ isLoading: false, data: formCards }));

    render(<EditInvoiceEntryForm entry={entry} onClose={onClose} refetch={refetch} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(0);

    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descri????o")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();

    expect(screen.getByText("Income Category Test")).toBeInTheDocument();
    expect(screen.getByText("Expense Category Test")).toBeInTheDocument();
  })

  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Descri????o'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Valor'), {target: { value: "" }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })
    
    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo categoria ?? inv??lido")).toBeInTheDocument();
    expect(screen.getByText("O campo descri????o ?? obrigat??rio")).toBeInTheDocument();
    expect(screen.getByText("O campo valor ?? obrigat??rio")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "2" }})
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
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(invoiceEntriesServiceMocked).toHaveBeenCalledTimes(1);
  })
})