import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { mocked } from "ts-jest/utils";
import { NavBalance } from "../../../../components/Layout/Header/NavBalance";
import { NavInvoices } from "../../../../components/Layout/Header/NavInvoices";
import { useSelector } from "../../../../hooks/useSelector";
import store from '../../../../store/createStore';
import { renderWithProviders } from "../../../../utils/test-utils";

const useSeletorMock = mocked(useSelector)

jest.mock("../../../../store/createStore");
jest.mock("../../../../hooks/useSelector");
jest.mock('broadcast-channel');

const openInvoicesMenu = {
  invoices: [{
    id: 1,
    due_date: '01/01/2001',
    closing_date: '01/01/2001',
    amount: 'R$ 150,00',
    paid: false,
    isClosed: false,
    hasPayable: false,
    card: {
      id: 1,
      name: 'Test'
    },
  }],
  total: 'R$ 150,00'
}

describe('NavInvoices Component', () => {

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('renders component correctly', async () => {
    useSeletorMock.mockImplementation(() => ({ isLoading: false, openInvoicesMenu }));

    renderWithProviders(<NavInvoices />, {store})

    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)
    
    await waitFor(() => {
      expect(screen.getByLabelText("Faturas")).toBeInTheDocument();
      
      expect(screen.getByText(openInvoicesMenu.invoices[0].due_date, {exact: false})).toBeInTheDocument()
      expect(screen.getAllByText(openInvoicesMenu.invoices[0].amount)[0]).toBeInTheDocument()
    })

  });

  it('renders when component is loading', async () => {
    useSeletorMock.mockImplementation(() => ({ isLoading: true, openInvoicesMenu }));

    renderWithProviders(<NavInvoices />, {store})

    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)
    
    await waitFor(() => {
      expect(screen.getByLabelText("Faturas")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    })

  });
})