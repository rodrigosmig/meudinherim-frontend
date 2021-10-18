import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { CreateAccountEntryForm } from "../../../../components/Foms/accountEntry/CreateAccountEntryForm";
import { CreatePayableForm } from "../../../../components/Foms/payable/CreatePayableForm";
import { payableService } from "../../../../services/ApiService/PayableService";

const payableServiceMocked = mocked(payableService.create);

jest.mock('react-query')
jest.mock('../../../../services/ApiService/PayableService')


const categories = [
  {
    value: "1",
    label: "Category Expense"
  },
  {
    value: "2",
    label: "Category Test"
  }
]

describe('CreatePayableForm Component', () => { 
  it('renders corretly', async () => {
    render(<CreatePayableForm categories={categories} />)

    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("Data")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    expect(screen.getByLabelText("Parcelar")).toBeInTheDocument();
    expect(screen.getByLabelText("Parcelar")).toBeDisabled();
    expect(screen.getByLabelText("Mensal")).toBeInTheDocument();
    //Categories
    expect(screen.getByRole("option", {name: "Category Expense"})).toBeInTheDocument();
    expect(screen.getByRole("option", {name: "Category Test"})).toBeInTheDocument();

  })

  it('validates required fields inputs', async () => {
    render(<CreatePayableForm categories={categories} />)

    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Data'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 0 }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByLabelText("Parcelar")).toBeDisabled();
    expect(screen.getByText("O campo data é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo categoria é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo descrição é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    render(<CreatePayableForm categories={categories} />)

    fireEvent.input(screen.getByLabelText('Categoria'), {target: { value: "2" }})
    fireEvent.input(screen.getByLabelText('Data'), {target: { value: '01/09/2021'}})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 0}})
    fireEvent.input(screen.getByLabelText('Descrição'), {target: {value: 'Te'}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByLabelText("Parcelar")).toBeDisabled();
    expect(screen.getByText("O campo descrição deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('tests installments', async () => {
    render(<CreatePayableForm categories={categories} />)

    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 100}})
    
    await waitFor(() => {
        fireEvent.click(screen.getByLabelText("Parcelar"));
    })
    
    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Salvar"}));
    })

    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByLabelText("Parcelar")).not.toBeDisabled();
    expect(screen.getByText("Numero de parcelas")).toBeInTheDocument();
    expect(screen.getByText("Valor da Parcela:")).toBeInTheDocument();    
  })
})