import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Pagination } from '../../components/Pagination';

jest.mock('../../hooks/useCategories')
jest.mock('react-query')

const onPageChange = jest.fn();

describe('Pagination Component', () => {

  beforeEach(() => {
    render(
      <Pagination 
        from={1}
        to={15}
        totalRegisters={37}
        lastPage={3}
        currentPage={1}
        onPageChange={onPageChange}
      />
    )
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(screen.getAllByRole('button')).toHaveLength(5); //3 buttons page, one prev button and one next button
    expect(screen.getByText('37')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(onPageChange).toHaveBeenCalledTimes(0);
  })

  it('test if the active page button is disabled', async () => {
    expect(screen.getByRole('button', {name: '1'})).toBeDisabled();
    expect(onPageChange).toHaveBeenCalledTimes(0);
  })

  it('test if the active page button is disabled', async () => {
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', {name: '2'}));
    })

    expect(onPageChange).toHaveBeenCalledTimes(1);
  })
})