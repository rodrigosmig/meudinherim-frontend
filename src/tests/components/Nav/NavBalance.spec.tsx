import { fireEvent, render, screen, waitFor } from '../../../utils/test-utils';
import { NavBalance } from '../../../components/Layout/Header/NavBalance';
import { useAccountBalance } from '../../../hooks/useAccountBalance';

const useAccountBalanceMocked = useAccountBalance as jest.Mock<any>;

jest.mock('../../../hooks/useAccountBalance');
jest.mock('react-query');

const data = {
  balances: [
    {
      balance: 100,
      positive: true,
      account_id: 1,
      account_name: "Test 1",
    },
    {
      balance: 400,
      positive: true,
      account_id: 2,
      account_name: "Account Test",
    }
  ],
  total: {
    value: 500,
    positive: true
  }
}

describe('Card Component', () => {
  beforeEach(() => {
    useAccountBalanceMocked.mockImplementation(() => ({ data: data, refetch: jest.fn() }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders add nav button correctly', async () => {
    render(
      <NavBalance />
    )
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button'));
    })

    expect(screen.getByText("Test 1")).toBeInTheDocument();
    expect(screen.getByText("Account Test")).toBeInTheDocument();
    expect(screen.getByText("Total:")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("400")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  })
})