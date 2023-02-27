import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { NavInvoices } from "../../../../components/Layout/Header/NavInvoices";
import { useOpenInvoices } from "../../../../hooks/useOpenInvoices";

const useOpenInvoicesMock = useOpenInvoices as jest.Mock<any>;

jest.mock('react-query')
jest.mock("../../../../hooks/useOpenInvoices");

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
    useOpenInvoicesMock.mockImplementation(() => ({ isLoading: false, data: openInvoicesMenu, isFetching: false }));

    render(<NavInvoices />)

    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)
    
    await waitFor(() => {
      expect(screen.getByLabelText("Faturas")).toBeInTheDocument();
      
      expect(screen.getByText(openInvoicesMenu.invoices[0].due_date, {exact: false})).toBeInTheDocument()
      expect(screen.getAllByText(openInvoicesMenu.invoices[0].amount)[0]).toBeInTheDocument()
    })

  });

  it('renders when component is loading', async () => {
    useOpenInvoicesMock.mockImplementation(() => ({ isLoading: true, data: openInvoicesMenu, isFetching: false }));

    render(<NavInvoices />)

    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)
    
    await waitFor(() => {
      expect(screen.getByLabelText("Faturas")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    })

  });

  it('renders when component is fetching', async () => {
    useOpenInvoicesMock.mockImplementation(() => ({ isLoading: false, data: openInvoicesMenu, isFetching: true }));

    render(<NavInvoices />)

    const notificationIcon = screen.getByRole('button')

    fireEvent.mouseOver(notificationIcon)

    await waitFor(() => {
      expect(screen.getByText("Faturas")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    })

  });
})