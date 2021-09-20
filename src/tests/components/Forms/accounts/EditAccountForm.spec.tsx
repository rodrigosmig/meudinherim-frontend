import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { EditAccountForm } from "../../../../components/Foms/account/EditAccountForm";
import { accountService } from "../../../../services/ApiService/AccountService";
import { mocked } from "ts-jest/utils";

const accountServiceMocked = mocked(accountService.update);

jest.mock('react-query')
jest.mock('../../../../services/ApiService/AccountService')

interface Account {
  id: number;
  type: {
    id: 'money' | 'savings' | 'checking_account' | 'investment';
    desc: string;
  }
  name: string;
  balance: number;
}

const account: Account = {
  id: 1,
  type: {
    id: 'checking_account',
    desc: "Saving"
  },
  balance: 50,
  name: "Account Test"
}

describe('EditAccountForm Component', () => {
  it('validates required fields inputs', async () => {
    render(<EditAccountForm account={account} />)

    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: "" } })

    fireEvent.input(screen.getByLabelText('Nome da Conta'), {
      target: {value: ''}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo tipo é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    render(<EditAccountForm account={account} />)

    fireEvent.input(screen.getByLabelText('Nome da Conta'), {
      target: {value: 'Te'}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })
    
    expect(accountServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
  })

  it('edit account successfuly', async () => {
    render(<EditAccountForm account={account} />)

    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: "savings" } })

    fireEvent.input(screen.getByLabelText('Nome da Conta'), {
      target: {value: 'Account Test updated'}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountServiceMocked).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Alteração realizada com sucesso")).toBeInTheDocument();
  })
})