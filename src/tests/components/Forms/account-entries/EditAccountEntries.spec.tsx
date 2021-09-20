import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { accountEntriesService } from "../../../../services/ApiService/AccountEntriesService";
import { EditAccountEntryForm } from "../../../../components/Foms/accountEntry/EditAccountEntryForm";

const accountEntriesServiceMocked = mocked(accountEntriesService.update);

jest.mock('react-query')
jest.mock('../../../../services/ApiService/AccountEntriesService')

const account = {
  id: 1,
  type: {
    id: 'checking_account',
    desc: "Saving"
  },
  balance: 50,
  name: "Account Test"
}

const entry = {
  id: 1,
  date: '2021-09-01',
  category: {
    id: 1,
    type: 1,
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

describe('EditAccountForm Component', () => {
  it('renders corretly', async () => {
    render(<EditAccountEntryForm entry={entry} categories={categoriesForm} />)

    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();

    expect(screen.getByText("Income Category")).toBeInTheDocument();
    expect(screen.getByText("Expense Category")).toBeInTheDocument();
  })


  it('validates required fields inputs', async () => {
    render(<EditAccountEntryForm entry={entry} categories={categoriesForm} />)

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
    render(<EditAccountEntryForm entry={entry} categories={categoriesForm} />)

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
    render(<EditAccountEntryForm entry={entry} categories={categoriesForm} />)

    fireEvent.change(screen.getByLabelText('Descrição'), {target: { value: "Account entry updated" }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountEntriesServiceMocked).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Alteração realizada com sucesso")).toBeInTheDocument();
  })
})