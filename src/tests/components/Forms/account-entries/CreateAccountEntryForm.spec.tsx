import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { CreateAccountEntryForm } from "../../../../components/Foms/accountEntry/CreateAccountEntryForm";
import { useAccountsForm } from "../../../../hooks/useAccounts";
import { useSelector } from "../../../../hooks/useSelector";
import { accountEntriesService } from "../../../../services/ApiService/AccountEntriesService";
import { IAccount } from "../../../../types/account";
import { IAccountEntry } from "../../../../types/accountEntry";

const accountEntriesServiceMocked = mocked(accountEntriesService.create);
const useSelectorMock = mocked(useSelector)
const useAccountsFormMocked = useAccountsForm as jest.Mock<any>;

jest.mock('react-query');
jest.mock('../../../../services/ApiService/AccountEntriesService');
jest.mock('../../../../hooks/useAccounts');
jest.mock('../../../../hooks/useSelector');

jest.mock('@chakra-ui/react', () => {
  const toast = jest.requireActual('@chakra-ui/react');
  return {
    ...toast,
    createStandaloneToast: () => jest.fn,
  };
});

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

const account: IAccount = {
  id: 1,
  type: {
    id: 'checking_account',
    desc: "Saving"
  },
  balance: 50,
  name: "Account Test",
  active: true
}

const entry: IAccountEntry = {
  id: 1,
  date: '2021-09-01',
  category: {
    id: 1,
    type: 2,
    name: 'Category test',
    active: true,
    show_in_dashboard: true
  },
  description: 'Account entry test',
  value: 50,
  account: account
}

describe('CreateAccountEntryForm Component', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation(() => ({ isLoading: false, categoriesForm: categories }));
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
    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "2" }})
    fireEvent.input(screen.getByLabelText('Data'), {target: { value: '01/09/2021'}})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 100}})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: entry.description}})

    accountEntriesServiceMocked.mockResolvedValueOnce({
      status: 200,
      headers: {},
      statusText: "",
      config: {},
      data: entry
    });

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountEntriesServiceMocked).toBeCalledTimes(1);
    //expect(screen.getByText("Lançamento Entry Test criado com sucesso")).toBeInTheDocument();
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