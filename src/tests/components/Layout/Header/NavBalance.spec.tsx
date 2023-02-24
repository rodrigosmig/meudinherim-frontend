import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { mocked } from "ts-jest/utils";
import { NavBalance } from "../../../../components/Layout/Header/NavBalance";
import { useSelector } from "../../../../hooks/useSelector";
import store from '../../../../store/createStore';
import { renderWithProviders } from "../../../../utils/test-utils";

const useSeletorMock = mocked(useSelector)

jest.mock("../../../../store/createStore");
jest.mock("../../../../hooks/useSelector");
jest.mock('broadcast-channel');

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

describe('NavBalance Component', () => {

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('renders component correctly', async () => {
    useSeletorMock.mockImplementation(() => ({ isLoading: false, balances: [balance], total }));

    renderWithProviders(<NavBalance />, {store})

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
    useSeletorMock.mockImplementation(() => ({ isLoading: true, balances: [balance], total }));
    renderWithProviders(<NavBalance />, {store})

    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)
    
    await waitFor(() => {
      expect(screen.getByLabelText("Contas")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    })

  });
})