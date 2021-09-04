import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useMutation } from "react-query";
import { useAccounts } from "../../hooks/useAccounts";
import Accounts from "../../pages/accounts";

const useAccountsMocked = useAccounts as jest.Mock<any>; 
const useMutationMocked = useMutation as jest.Mock<any>; 

jest.mock('../../hooks/useAccounts')
jest.mock('react-query')

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

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/accounts'
      }
    }
  }
})

const data = [
  {id: 1, type: {id: "money", desc: "Money"}, name: "Account Test", balance: 50},
  {id: 2, type: {id: "savings", desc: "Savings"}, name: "Account Savings", balance: 150}
]

describe('Accounts Component', () => {
    beforeEach(() => {
      useAccountsMocked.mockImplementation(() => ({ isLoading: true }));
      useMutationMocked.mockImplementation(() => ({ isLoading: true }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

  it('Displays loading indicator', () => {
    render(
      <Accounts />
    )
    
    expect(useAccountsMocked).toHaveBeenCalled();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("Displays error message", () => {
		useAccountsMocked.mockImplementation(() => ({
			isLoading: false,
			isError: true,
		}));

		render(
      <Accounts />
    )

		expect(screen.getByText("Falha ao obter as contas")).toBeInTheDocument();
	});

  it("Displays Accounts", () => {
		useAccountsMocked.mockImplementation(() => ({
			isLoading: false,
      data
		}));

		render(
      <Accounts />
    )

    expect(screen.getByText("Account Test")).toBeInTheDocument();
    expect(screen.getByText("Account Savings")).toBeInTheDocument();
	});

  it("Displays delete confirmation", async () => {
    const accounts = [
      {id: 1, type: {id: "money", desc: "Money"}, name: "Account Test", balance: 50},
    ]

		useAccountsMocked.mockImplementation(() => ({
			isLoading: false,
      data: accounts
		}));

    useMutationMocked.mockImplementation(() => ({
			isLoading: false,
      mutateAsync: jest.fn()
		}));    

		render(
      <Accounts />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Delete'}));
    })
//screen.debug(null, 30000)
    expect(screen.getByText("Deletar")).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Deletar'})).toBeInTheDocument();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});
})