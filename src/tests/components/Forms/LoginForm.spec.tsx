import { fireEvent, screen } from "@testing-library/dom";
import router from "next/router";
import { act } from "react-dom/test-utils";
import { mocked } from "ts-jest/utils";
import { LoginForm } from "../../../components/Foms/auth/LoginForm";
import store from '../../../store/createStore';
import { renderWithProviders } from "../../../utils/test-utils";


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

const dispatchMock = mocked(store.dispatch)
const routerMock = mocked(router.push)

jest.mock('next/router');
jest.mock("../../../store/createStore");
jest.mock('broadcast-channel');

describe('LoginForm Component', () => { 

  beforeEach(() => {
    renderWithProviders(<LoginForm />, {store})
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('renders component correctly', async () => {
    expect(screen.getByRole('button', {name: 'Entrar'})).not.toBeDisabled
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    expect(screen.getByRole('link', {name: 'Esqueci minha senha'})).toBeInTheDocument
    expect(screen.getByRole('link', {name: 'Cadastrar novo usuário'})).toBeInTheDocument

    expect(dispatchMock).not.toBeCalled()
    expect(routerMock).not.toBeCalled()
  });

  it('validates required fields', async () => {
    const enterButton = screen.getByText('Entrar');

    await act(async () => {
      fireEvent.submit(enterButton)
    })

    expect(screen.getByText("O campo email é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo senha é obrigatório")).toBeInTheDocument();

    expect(dispatchMock).not.toBeCalled()
    expect(routerMock).not.toBeCalled()
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
      fireEvent.submit(enterButton)
    })

    expect(enterButton).not.toBeDisabled();
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
    expect(screen.getByText("O campo senha deve ter no mínimo 8 caracteres")).toBeInTheDocument();

    expect(dispatchMock).not.toBeCalled()
    expect(routerMock).not.toBeCalled()
  });

  it('login successfully', async () => {
    const enterButton = screen.getByText('Entrar') as HTMLInputElement;

    dispatchMock.mockReturnValue({unwrap: () => Promise.resolve()})

    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'test@email.com'}
    })

    fireEvent.input(screen.getByLabelText('Senha'), {
      target: {value: '12345678'}
    })

    await act(async () => {
      fireEvent.submit(enterButton)
    })

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(dispatchMock).toBeCalled()
    expect(routerMock).toBeCalled()
  });

  it('login error when fill with invalid credentials', async () => {
    const enterButton = screen.getByText('Entrar') as HTMLInputElement;

    const response = {
      response: {
        status: 422,
        headers: {},
        statusText: "",
        config: {},
        data:{
          error: ["invalid credentials"]
        }
      }      
    }

    dispatchMock.mockReturnValue({unwrap: () => Promise.reject(response)})

    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'test@email.com'}
    })

    fireEvent.input(screen.getByLabelText('Senha'), {
      target: {value: '12345678'}
    })

    await act(async () => {
      fireEvent.submit(enterButton)
    })

    expect(screen.getByText("Falha ao Entrar")).toBeInTheDocument();
    expect(screen.getByText("As credenciais informadas são inválidas")).toBeInTheDocument();

    expect(dispatchMock).toBeCalled()
    expect(routerMock).not.toBeCalled()
  });

  it('login error when server rejected fields', async () => {
    const enterButton = screen.getByText('Entrar') as HTMLInputElement;

    const response = {
      response: {
        status: 422,
        headers: {},
        statusText: "",
        config: {},
        data:{
          email: ["invalid email"],
          password: ["invalid password"]
        }
      }      
    }

    dispatchMock.mockReturnValue({unwrap: () => Promise.reject(response)})

    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'test@email.com'}
    })

    fireEvent.input(screen.getByLabelText('Senha'), {
      target: {value: '12345678'}
    })

    await act(async () => {
      fireEvent.submit(enterButton)
    })

    expect(screen.getByText(response.response.data.email[0])).toBeInTheDocument();
    expect(screen.getByText(response.response.data.password[0])).toBeInTheDocument();

    expect(dispatchMock).toBeCalled()
    expect(routerMock).not.toBeCalled()
  });
})
