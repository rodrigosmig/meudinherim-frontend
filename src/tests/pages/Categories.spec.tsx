import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useMutation } from "react-query";
import { useCategories } from "../../hooks/useCategories";
import Categories from "../../pages/categories";

const useCategoriesMocked = useCategories as jest.Mock<any>; 
const useMutationMocked = useMutation as jest.Mock<any>; 

jest.mock('../../hooks/useCategories')
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
        asPath: '/categories'
      }
    }
  }
})

const data = {
  categories: [
    {id: 1, type: 1, name: "Income Category Test"},
    {id: 2, type: 2, name: "Expense Category Test"}
  ],
  meta: {
    from: 1,
    to: 10,
    current_page: 1,
    last_page: 5,
    per_page: 10,
    total: 50
  }
}

describe('Categories Component', () => {
    beforeEach(() => {
      useCategoriesMocked.mockImplementation(() => ({ isLoading: true }));
      useMutationMocked.mockImplementation(() => ({ isLoading: true }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  
  it('Renders without crashing', () => {
    render(
      <Categories />
    )

    expect(useCategoriesMocked).toHaveBeenCalled();
  });

  it('Displays loading indicator', () => {
    render(
      <Categories />
    )

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("Displays error message", () => {
		useCategoriesMocked.mockImplementation(() => ({
			isLoading: false,
			isError: true,
		}));

		render(
      <Categories />
    )

		expect(screen.getByText("Falha ao obter as categorias")).toBeInTheDocument();
	});

  it("Displays categories", () => {
		useCategoriesMocked.mockImplementation(() => ({
			isLoading: false,
      data
		}));

		render(
      <Categories />
    )

		expect(screen.getByText("Income Category Test")).toBeInTheDocument();
    expect(screen.getByText("Expense Category Test")).toBeInTheDocument();
	});

  it("Displays delete confirmation", async () => {
    const categories = [
      {id: 1, type: 1, name: 'Sales'},
    ]

		useCategoriesMocked.mockImplementation(() => ({
			isLoading: false,
      data: {
        categories: categories,
        meta: {
          from: 1,
          to: 10,
          current_page: 1,
          last_page: 5,
          per_page: 10,
          total: 50
        }
      }
		}));

    useMutationMocked.mockImplementation(() => ({
			isLoading: false,
      mutateAsync: jest.fn()
		}));    

		render(
      <Categories />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Delete categoria'}));
    })

    expect(screen.getByText("Deletar")).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Deletar'})).toBeInTheDocument();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});
})