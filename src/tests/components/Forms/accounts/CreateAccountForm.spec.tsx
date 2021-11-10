import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { act } from "react-dom/test-utils";
import { accountService } from "../../../../services/ApiService/AccountService";
import { CreateAccountForm } from "../../../../components/Foms/account/CreateAccountForm";

const accountServiceMocked = mocked(accountService.create);

jest.mock('react-query')
jest.mock('../../../../services/ApiService/AccountService')

const closeModal = jest.fn;
const refetch = jest.fn;

describe('CreateAccountForm Component', () => {
  beforeEach(() => {
    render(<CreateAccountForm closeModal={closeModal} refetch={refetch} />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(screen.getByText("Dinheiro")).toBeInTheDocument();
    expect(screen.getByText("Poupança")).toBeInTheDocument();
    expect(screen.getByText("Conta Corrente")).toBeInTheDocument();
    expect(screen.getByText("Investimentos")).toBeInTheDocument();
    expect(screen.getByText("Nome da Conta")).toBeInTheDocument();
  })

  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: "" } })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo tipo é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: "savings" } })

    fireEvent.input(screen.getByLabelText('Nome da Conta'), {
      target: {value: 'Te'}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })
    
    expect(accountServiceMocked).toBeCalledTimes(0);
    expect(screen.getByText("O campo nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
  })

  it('create account successfuly', async () => {
    fireEvent.change(screen.getByRole('combobox'), {name: 'Tipo', target: { value: 'savings' } })

    fireEvent.input(screen.getByLabelText('Nome da Conta'), {
      target: {value: 'Account Test created'}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(accountServiceMocked).toBeCalledTimes(1);
    expect(screen.getByText("Conta Account Test created criada com sucesso")).toBeInTheDocument();
  })
})