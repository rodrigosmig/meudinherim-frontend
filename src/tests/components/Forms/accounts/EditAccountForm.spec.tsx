import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { EditAccountForm } from "../../../../components/Foms/account/EditAccountForm";
import { accountService } from "../../../../services/ApiService/AccountService";
import { mocked } from "ts-jest/utils";
import { IAccount } from "../../../../types/account";

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

const accountServiceMocked = mocked(accountService.update);

jest.mock('react-query')
jest.mock('../../../../services/ApiService/AccountService')

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

const closeModal = jest.fn;
const refetch = jest.fn;

describe('EditAccountForm Component', () => {
  beforeEach(() => {
    render(<EditAccountForm account={account} closeModal={closeModal} refetch={refetch} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validates required fields inputs', async () => {
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