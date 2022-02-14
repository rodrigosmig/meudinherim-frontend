import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { accountEntriesService } from "../../../../services/ApiService/AccountEntriesService";
import { EditAccountEntryForm } from "../../../../components/Foms/accountEntry/EditAccountEntryForm";
import { useCategoriesForm } from "../../../../hooks/useCategories";
import { IAccount } from "../../../../types/account";
import { IAccountEntry } from "../../../../types/accountEntry";

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
const useCategoriesFormMocked = useCategoriesForm as jest.Mock<any>;
const accountEntriesServiceMocked = mocked(accountEntriesService.update);

jest.mock('react-query')
jest.mock('../../../../services/ApiService/AccountEntriesService');
jest.mock('../../../../hooks/useCategories');

const account: IAccount = {
  id: 1,
  type: {
    id: 'checking_account',
    desc: "Saving"
  },
  balance: 50,
  name: "Account Test"
}

const entry: IAccountEntry = {
  id: 1,
  date: '2021-09-01',
  category: {
    id: 1,
    type: 2,
    name: 'Category test'
  },
  description: 'Account entry test',
  value: 50,
  account: account
}

const categoriesForm = {
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

type CategoriesForForm = {
  income: {
    id: number;
    label: string
  }[]
  expense: {
    id: number;
    label: string
  }[]
}

const data = {
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

const closeModal = jest.fn;
const refetch = jest.fn;

describe('EditAccountEntryForm Component', () => {
  beforeEach(() => {
    useCategoriesFormMocked.mockImplementation(() => ({ isLoading: false, data }));

    render(<EditAccountEntryForm entry={entry} closeModal={closeModal} refetch={refetch} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();

    expect(screen.getByText("Income Category Test")).toBeInTheDocument();
    expect(screen.getByText("Expense Category Test")).toBeInTheDocument();
  })


  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByLabelText('Categoria'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Data'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Descrição'), {target: { value: "" }})
    fireEvent.change(screen.getByLabelText('Valor'), {target: { value: "" }})
    

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo categoria é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo descrição é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo data é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo valor é obrigatório")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.change(screen.getByLabelText('Descrição'), {target: { value: "Te" }})
    fireEvent.change(screen.getByLabelText('Valor'), {target: { value: -100 }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })
    
    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
    expect(screen.getByText("O campo descrição deve ter no mínimo 3 caracteres")).toBeInTheDocument();
  })

  it('edit account successfuly', async () => {
    fireEvent.change(screen.getByLabelText('Descrição'), {target: { value: "Account entry updated" }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Alteração realizada com sucesso")).toBeInTheDocument();
  })
})