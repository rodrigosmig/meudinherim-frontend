import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mocked } from 'ts-jest/utils';
import { EditPayableForm } from "../../../../components/Foms/payable/EditPayableForm";
import { PaymentForm } from "../../../../components/Foms/payable/PaymentForm";
import { payableService } from "../../../../services/ApiService/PayableService";
import { IPayable } from "../../../../types/payable";

const payableServiceMocked = mocked(payableService.payment);

jest.mock('react-query')
jest.mock('../../../../services/ApiService/PayableService')

const onCancel = jest.fn();
const refetch = jest.fn();

const accounts = [
  {
    value: "1",
    label: "Account Test"
  },
  {
    value: "2",
    label: "Account Testable"
  }
]

const payable: IPayable = {
    id: 1,
    due_date: "2021-10-21",
    paid_date: null,
    description: "Payable test",
    value: 150.50,
    category: {
        id: 1,
        name: "Category Test",
        type: 2
    },
    invoice: null,
    paid: false,
    monthly: false,
    has_parcels: false,
    is_parcel: false,
    total_purchase: null,
    parcel_number: null,
    parcelable_id: null,
  }

describe('EditPayableForm Component', () => {
  beforeEach(() => {
    render(<PaymentForm 
        payable={payable} 
        accounts={accounts}
        onCancel={onCancel}
        refetch={refetch}
    />)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders corretly', async () => {

    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("Vencimento")).toBeInTheDocument();
    expect(screen.getByText("Data do Pagamento")).toBeInTheDocument();
    expect(screen.getByText("Categoria")).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("Valor")).toBeInTheDocument();
    expect(screen.getByLabelText("Mensal")).toBeInTheDocument();
    //Accounts
    expect(screen.getByText("Account Test")).toBeInTheDocument();
    expect(screen.getByText("Account Testable")).toBeInTheDocument();

  })

  it('validates required fields inputs', async () => {
    fireEvent.change(screen.getByLabelText('Data do Pagamento'), {target: { value: "" }})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: "" }})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Pagar"}));
    })

    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O campo conta é inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo data de pagamento é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo valor é inválido")).toBeInTheDocument();
  })

  it('validates user inputs', async () => {
    fireEvent.change(screen.getByLabelText('Conta'), {target: { value: "2" }})
    fireEvent.input(screen.getByLabelText('Data do Pagamento'), {target: { value: '01/09/2021'}})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 0}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Pagar"}));
    })

    
    expect(payableServiceMocked).toHaveBeenCalledTimes(0);
    expect(screen.getByText("O valor deve ser maior que zero")).toBeInTheDocument();
  })

  it('Payment successfully', async () => {
    fireEvent.change(screen.getByLabelText('Conta'), {target: { value: "1" }})
    fireEvent.input(screen.getByLabelText('Data do Pagamento'), {target: { value: '01/09/2021'}})
    fireEvent.input(screen.getByLabelText('Valor'), {target: { value: 50}})

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", {name: "Pagar"}));
    })

    expect(payableServiceMocked).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Conta paga com sucesso")).toBeInTheDocument();
  })
})