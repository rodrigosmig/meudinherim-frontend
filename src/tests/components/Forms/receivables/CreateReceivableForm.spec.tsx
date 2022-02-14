import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { CreateReceivableForm } from "../../../../components/Foms/receivable/CreateReceivableForm";
import { receivableService } from "../../../../services/ApiService/ReceivableService";

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

const receivableServiceMocked = mocked(receivableService.create);

jest.mock('react-query')
jest.mock('../../../../services/ApiService/ReceivableService')

const categories = [
  {
    value: "1",
    label: "Category Income"
  },
  {
    value: "2",
    label: "Category Test"
  }
]

const closeModal = jest.fn;
const refetch = jest.fn;

describe('CreateReceivableForm Component', () => {
  beforeEach(() => {
    render(<CreateReceivableForm categories={categories} onCancel={closeModal} refetch={refetch}  />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {
    expect(receivableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("Vencimento")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    expect(screen.getByLabelText("Parcelar")).toBeInTheDocument();
    expect(screen.getByLabelText("Parcelar")).toBeDisabled();
    expect(screen.getByLabelText("Mensal")).toBeInTheDocument();
    //Categories
    expect(screen.getByRole("option", {name: "Category Income"})).toBeInTheDocument();
    expect(screen.getByRole("option", {name: "Category Test"})).toBeInTheDocument();

  })

  it('validates required fields inputs', async () => {
    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Vencimento'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 0 }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(receivableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByLabelText("Parcelar")).toBeDisabled();
    expect(screen.getByText("O campo vencimento é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo categoria é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo descrição é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "2" }})
    fireEvent.input(screen.getByLabelText('Vencimento'), {target: { value: '01/09/2021'}})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 0}})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: 'Te'}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(receivableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByLabelText("Parcelar")).toBeDisabled();
    expect(screen.getByText("O campo descrição deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('tests installments', async () => {
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 100}})
    
    await waitFor(() => {
        fireEvent.click(screen.getByLabelText("Parcelar"));
    })
    
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(receivableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByLabelText("Parcelar")).not.toBeDisabled();
    expect(screen.getByText("Numero de parcelas")).toBeInTheDocument();
    expect(screen.getByText("Valor da Parcela:")).toBeInTheDocument();    
  })
})