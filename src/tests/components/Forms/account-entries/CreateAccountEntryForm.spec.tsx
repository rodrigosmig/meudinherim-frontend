import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { accountEntriesService } from "../../../../services/ApiService/AccountEntriesService";
import { CreateAccountEntryForm } from "../../../../components/Foms/accountEntry/CreateAccountEntryForm";
import { useCategoriesForm } from "../../../../hooks/useCategories";
import { useAccountsForm } from "../../../../hooks/useAccounts";

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

const accountEntriesServiceMocked = mocked(accountEntriesService.create);
const useCategoriesFormMocked = useCategoriesForm as jest.Mock<any>;
const useAccountsFormMocked = useAccountsForm as jest.Mock<any>;

jest.mock('react-query');
jest.mock('../../../../services/ApiService/AccountEntriesService');
jest.mock('../../../../hooks/useCategories');
jest.mock('../../../../hooks/useAccounts');

const onCancel = jest.fn();

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
  }
];

describe('CreateAccountEntryForm Component', () => {
  beforeEach(() => {
    useCategoriesFormMocked.mockImplementation(() => ({ isLoading: false, data: categories }));
    useAccountsFormMocked.mockImplementation(() => ({ isLoading: false, data: accounts }));

    render(<CreateAccountEntryForm  onClose={onCancel} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(0);

    expect(screen.getByText("Conta")).toBeInTheDocument();
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();

    expect(screen.getByText("Income Category")).toBeInTheDocument();
    expect(screen.getByText("Expense Category")).toBeInTheDocument();
  });

  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByLabelText('Conta'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Data'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Valor'), {target: { value: "" }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    });
    
    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo conta é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo data é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo categoria é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo descrição é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo valor é obrigatório")).toBeInTheDocument();
  });

  it('validates user inputs', async () => {
    fireEvent.change(screen.getByLabelText('Conta'), {target: { value: "1" }})
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "2" }})
    fireEvent.change(screen.getByLabelText('Data'), {target: { value: '01/09/2021'}})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: -100}})

    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: 'Te'}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo descrição deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
    
  });

  it('create account successfuly', async () => {
    fireEvent.change(screen.getByLabelText('Conta'), {target: { value: "1" }})
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "2" }})
    fireEvent.change(screen.getByLabelText('Data'), {target: { value: '01/09/2021'}})
    fireEvent.change(screen.getByLabelText('Valor'), {target: { value: 100}})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: 'Entry Test'}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountEntriesServiceMocked).toBeCalledTimes(1);
    expect(screen.getByText("Lançamento Entry Test criado com sucesso")).toBeInTheDocument();
  });

  it('error when validates form by server', async () => {
    fireEvent.change(screen.getByLabelText('Conta'), {target: { value: "1" }})
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "2" }})
    fireEvent.change(screen.getByLabelText('Data'), {target: { value: '01/09/2021'}})
    fireEvent.change(screen.getByLabelText('Valor'), {target: { value: 100}})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: 'Entry Test'}})

    const response = {
      date: ["error date"],
      description: ["error description"],
      value: ["error value"]
    } 

    accountEntriesServiceMocked.mockRejectedValue({
      response: {
        status: 422,
        headers: {},
        statusText: "",
        config: {},
        data: response
      }
      
    })

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountEntriesServiceMocked).toBeCalledTimes(1);
    expect(screen.getByText(response.date[0])).toBeInTheDocument();
    expect(screen.getByText(response.description[0])).toBeInTheDocument();
    expect(screen.getByText(response.value[0])).toBeInTheDocument();
  });
})