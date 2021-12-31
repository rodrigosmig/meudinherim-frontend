import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { notDeepEqual } from "assert";
import { mocked } from 'ts-jest/utils';
import { TransferBetweenAccountsForm } from "../../../../components/Foms/accountEntry/TransferBetweenAccountsForm";
import { useAccountsForm } from "../../../../hooks/useAccounts";
import { useCategoriesForm } from "../../../../hooks/useCategories";
import { accountEntriesService } from "../../../../services/ApiService/AccountEntriesService";

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

const accountEntriesServiceMocked = mocked(accountEntriesService.accountTransfer);
const useCategoriesFormMocked = useCategoriesForm as jest.Mock<any>;
const useAccountsFormMocked = useAccountsForm as jest.Mock<any>;

jest.mock('react-query')
jest.mock('../../../../services/ApiService/AccountEntriesService');
jest.mock('../../../../hooks/useCategories');
jest.mock('../../../../hooks/useAccounts');

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

const accounts = [
  {
    value: "1",
    label: "Account Test"
  },
  {
    value: "2",
    label: "New Account Test"
  }
];

const closeModal = jest.fn();

describe('TransferBeetAccountsForm Component', () => {
  beforeEach(() => {
    useCategoriesFormMocked.mockImplementation(() => ({ isLoading: false, data: categories }));
    useAccountsFormMocked.mockImplementation(() => ({ isLoading: false, data: accounts }));

    render(<TransferBetweenAccountsForm
      onCancel={closeModal}
    />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("Conta de origem")).toBeInTheDocument();
    expect(screen.getByText("Categoria de origem")).toBeInTheDocument();
    expect(screen.getByText("Conta de destino")).toBeInTheDocument();
    expect(screen.getByText("Categoria de destino")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    
    //Categories
    expect(screen.getByRole("option", {name: "Income Category"})).toBeInTheDocument();
    expect(screen.getByRole("option", {name: "Expense Category"})).toBeInTheDocument();

    //Accounts
    expect(screen.getAllByRole("option", {name: "Account Test"}).length).toEqual(2);

  })

  it('validates required fields inputs', async () => {
    
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    });

    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo conta de origem é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo categoria de origem é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo conta de destino é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo categoria de destino é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo descrição é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo valor é inválido")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.change(screen.getByLabelText('Categoria de origem'), {target: { value: "2" }});
    fireEvent.change(screen.getByLabelText('Categoria de destino'), {target: { value: "1" }});
    fireEvent.change(screen.getByLabelText('Conta de origem'), {target: { value: "2" }});
    fireEvent.change(screen.getByLabelText('Conta de destino'), {target: { value: "1" }});    
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: -1}})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: 'Te'}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    });

    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(0);  
    expect(screen.getByText("O campo descrição deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('transfers successfuly', async () => {
    fireEvent.change(screen.getByLabelText('Categoria de origem'), {target: { value: "2" }});
    fireEvent.change(screen.getByLabelText('Categoria de destino'), {target: { value: "1" }});
    fireEvent.change(screen.getByLabelText('Conta de origem'), {target: { value: "2" }});
    fireEvent.change(screen.getByLabelText('Conta de destino'), {target: { value: "1" }});
    
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 100}})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: 'Test'}})
   
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Transferência realizada com sucesso")).toBeInTheDocument(); 
  })
})