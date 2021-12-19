import { act } from "react-dom/test-utils";
import { LoginForm } from "../../../components/Foms/auth/LoginForm";
import { fireEvent, render, screen } from "../../../utils/test-utils";

describe('LoginForm Component', () => {
  beforeEach(() => {
    render(<LoginForm />)
  });

  it('validates required fields', async () => {
    await act(async () => {
      fireEvent.submit(screen.getByText('Entrar'))
    })

    expect(screen.getByText("O campo email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo senha é obrigatório")).toBeInTheDocument();
  });

  it('validates user inputs', async () => {
    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'Test'}
    })

    fireEvent.input(screen.getByLabelText('Senha'), {
      target: {value: '123456'}
    })

    await act(async () => {
      fireEvent.click(screen.getByText('Entrar'))
    })

    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo senha deve ter no mínimo 8 caracteres")).toBeInTheDocument();
  });
})