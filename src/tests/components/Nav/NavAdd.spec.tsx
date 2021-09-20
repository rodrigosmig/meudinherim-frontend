import { fireEvent, render, screen, waitFor } from '../../../utils/test-utils';
import { NavAdd } from '../../../components/Layout/Header/NavAdd';

describe('Card Component', () => {
  it('renders add nav button correctly', async () => {
    render(
      <NavAdd />
    )
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button'));
    })

    expect(screen.getByText("Lançamento no cartão")).toBeInTheDocument();
    expect(screen.getByText("Lançamento na conta")).toBeInTheDocument();
    expect(screen.getByText("Conta a receber")).toBeInTheDocument();
    expect(screen.getByText("Conta a pagar")).toBeInTheDocument();
  })
})