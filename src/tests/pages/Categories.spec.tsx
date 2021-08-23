import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useMutation } from "react-query";
import { useCategories } from "../../hooks/useCategories";
import Categories from "../../pages/categories";

const useProductMocked = useCategories as jest.Mock<any>; 
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

describe('Categories Component', () => {
    beforeEach(() => {
      useProductMocked.mockImplementation(() => ({ isLoading: true }));
      useMutationMocked.mockImplementation(() => ({ isLoading: true }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  
  it('Renders without crashing', () => {
    render(
      <Categories />
    )

    expect(useProductMocked).toHaveBeenCalled();
  });

  it('Displays loading indicator', () => {
    render(
      <Categories />
    )

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("Displays error message", () => {
		useProductMocked.mockImplementation(() => ({
			isLoading: false,
			isError: true,
		}));

		render(
      <Categories />
    )

		expect(screen.getByText("Falha ao obter as categorias")).toBeInTheDocument();
	});

  it("Displays categories", () => {
    const categories = [
      {id: 1, type: 1, name: 'Sales'},
      {id: 2, type: 2, name: 'Orders'}
    ]

		useProductMocked.mockImplementation(() => ({
			isLoading: false,
      data: categories
		}));

		render(
      <Categories />
    )

		expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
	});

  it("Displays edit modal", async () => {
    const categories = [
      {id: 1, type: 1, name: 'Sales'},
    ]

		useProductMocked.mockImplementation(() => ({
			isLoading: false,
      data: categories
		}));

    useMutationMocked.mockImplementation(() => ({
			isLoading: false,
      mutateAsync: jest.fn()
		}));    

		render(
      <Categories />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Edit category'}));
    })

		expect(useMutationMocked).toHaveBeenCalled();
    expect(screen.getByText("Editar Categoria")).toBeInTheDocument();
	});

  it("Displays delete confirmation", async () => {
    const categories = [
      {id: 1, type: 1, name: 'Sales'},
    ]

		useProductMocked.mockImplementation(() => ({
			isLoading: false,
      data: categories
		}));

    useMutationMocked.mockImplementation(() => ({
			isLoading: false,
      mutateAsync: jest.fn()
		}));    

		render(
      <Categories />
    )

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: 'Delete category'}));
    })

    expect(screen.getByText("Deletar")).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Deletar'})).toBeInTheDocument();
	});
})