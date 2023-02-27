import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { NavBalance } from "../../../../components/Layout/Header/NavBalance";
import { useAccountBalance } from "../../../../hooks/useAccountBalance";

const useAccountBalanceMock = useAccountBalance as jest.Mock<any>;

jest.mock('react-query')
jest.mock('../../../../hooks/useAccountBalance');

const balance = {
  balance: "R$ 100,00",
  positive: true,
  account_id: 1,
  account_name: "Test Account"
}

const total = {
  value: "R$ 100,00",
  positive: true
}


const data = {
  balances: [balance],
  total
}

describe('NavBalance Component', () => {


  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('renders component correctly', async () => {
    useAccountBalanceMock.mockImplementation(() => ({ isLoading: false, data, isFetching: false }));

    render(<NavBalance />)
    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)
    
    await waitFor(() => {
      expect(screen.getByLabelText("Contas")).toBeInTheDocument();

      expect(screen.getByText(balance.account_name)).toBeInTheDocument()
      expect(screen.getAllByText(balance.balance)[0]).toBeInTheDocument()
      expect(screen.getAllByText(total.value)[1]).toBeInTheDocument()
    })

  });

  it('renders when component is loading', async () => {
    useAccountBalanceMock.mockImplementation(() => ({ isLoading: true, data, isFetching: false }));

    render(<NavBalance />)

    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)

    await waitFor(() => {
      expect(screen.getByLabelText("Contas")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    })

  });

  it('renders when component is fetching', async () => {
    useAccountBalanceMock.mockImplementation(() => ({ isLoading: false, data, isFetching: true }));

    render(<NavBalance />)

    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)

    await waitFor(() => {
      expect(screen.getByText("Contas")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    })

  });
})