import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { GeneratePaymentForm } from "../../../../components/Foms/payable/GeneratePaymentForm";
import { useCategoriesForm } from "../../../../hooks/useCategories";
import { payableService } from "../../../../services/ApiService/PayableService";

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

const payableServiceMocked = mocked(payableService.create);
const useCategoriesFormMocked = useCategoriesForm as jest.Mock<any>;

jest.mock('react-query');
jest.mock('../../../../services/ApiService/PayableService');
jest.mock('../../../../hooks/useCategories');

const onCancel = jest.fn();

const invoice = {
  id: 1,
  due_date: '2022-02-07',
  closing_date: '2022-01-30',
  amount: 1500,
  paid: false,
  isClosed: false,
  hasPayable: false,
  card: {
      id: 1,
      name: 'Test'
  }
}

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

describe('GeneratePaymentForm Component', () => {
  beforeEach(() => {
    useCategoriesFormMocked.mockImplementation(() => ({ isLoading: false, data: categories }));

    render(<GeneratePaymentForm invoice={invoice} onCancel={onCancel} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(onCancel).toHaveBeenCalledTimes(0);
    
    expect(screen.getByText("Vencimento")).toBeInTheDocument();
    expect(screen.getByDisplayValue("07/02/2022")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fatura: Test")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    expect(screen.getByDisplayValue("R$ 1.500,00")).toBeInTheDocument();  
    
    //Categories
    expect(screen.getByRole("option", {name: "Expense Category"})).toBeInTheDocument();
  });

  it('validates required fields inputs', async () => {
    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "" }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Gerar Pagamento"}));
    })

    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(onCancel).toHaveBeenCalledTimes(0);

    expect(screen.getByText("O campo categoria é inválido")).toBeInTheDocument();
  });

  it('tests cancel button', async () => {
    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", {name: "Cancelar"}));
    })
    
    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('tests generate payable successfully', async () => {
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "2" }})
   
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Gerar Pagamento"}));
    })

    expect(payableServiceMocked).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(0);
    expect(screen.getByText("Conta a pagar gerado com sucesso")).toBeInTheDocument(); 
  })
})