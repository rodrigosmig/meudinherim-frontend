import { act } from "react-dom/test-utils";
import { LoginForm } from "../../../components/Foms/auth/LoginForm";
import { fireEvent, render, screen } from "../../../utils/test-utils";

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

jest.mock('react-google-recaptcha', () => {
  const ReCaptchaV2 = () => {
    return (
      <input type="checkbox" 
        data-testid="recaptcha-register"
        onChange={jest.fn}
      />
    )
  }
  return ReCaptchaV2;
});

describe('LoginForm Component', () => {
  beforeEach(() => {
    render(<LoginForm />)
  });

  it('validates required fields', async () => {
    const enterButton = screen.getByText('Entrar');

    await act(async () => {
      fireEvent.submit(enterButton)
    })

    expect(enterButton).toBeDisabled();
    expect(screen.getByText("O campo email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo senha é obrigatório")).toBeInTheDocument();
  });

  it('validates user inputs', async () => {
    const enterButton = screen.getByText('Entrar') as HTMLInputElement;
    enterButton.disabled = false;

    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'Test'}
    })

    fireEvent.input(screen.getByLabelText('Senha'), {
      target: {value: '123456'}
    })

    await act(async () => {
      fireEvent.click(enterButton)
    })

    expect(enterButton).not.toBeDisabled();
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo senha deve ter no mínimo 8 caracteres")).toBeInTheDocument();
  });
})