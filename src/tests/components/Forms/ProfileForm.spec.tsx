import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { act } from "react-dom/test-utils";
import { mocked } from 'ts-jest/utils';
import { ProfileForm } from "../../../components/Foms/profile/ProfileForm";
import { useSelector } from "../../../hooks/useSelector";
import store from '../../../store/createStore';
import { renderWithProviders } from "../../../utils/test-utils";

const dispatchMock = mocked(store.dispatch)
const useSeletorMock = mocked(useSelector)

jest.mock("../../../store/createStore");
jest.mock("../../../hooks/useSelector");
jest.mock('broadcast-channel');

const user = {
  id: 1,
  name: "test",
  email: "test@test.com",
  avatar: "test",
  enable_notification: true,
  hasEmailVerified: true,
}

describe('ProfileForm Component', () => {
  beforeEach(() => {
    useSeletorMock.mockImplementation(() => ({ user: user }));

    renderWithProviders(<ProfileForm />, {store})
  });

  it('renders correctly', async () => {
    expect(screen.getByRole("button", {name: "Alterar"})).toBeDisabled();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Receber notificações")).toBeInTheDocument();
  });
  
  it('validates required inputs', async () => {
    fireEvent.input(screen.getByLabelText('Nome'), {
      target: {value: ''}
    })

    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: ''}
    })

    fireEvent.submit(screen.getByRole("button", { name: "Alterar" }));

    await waitFor(() => {
      expect(screen.getByRole("button", {name: "Alterar"})).not.toBeDisabled();
      expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("O campo email é obrigatório")).toBeInTheDocument();
    })
    
    
  });

  it('validates user inputs', async () => {

    fireEvent.input(screen.getByLabelText('Nome'), {
      target: {value: 'T'}
    })

    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'Test'}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Alterar" }));
    })

    expect(screen.getByRole("button")).not.toBeDisabled();
    expect(screen.getByText("O campo nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
  });

  it('allows the user to change data successfuly', async () => {
    const response = {
      status: 200,
      headers: {},
      statusText: "",
      config: {},
      data:{
        id: 1,
        name: 'Test Changed',
        email: 'test2@test.com',
        avatar: 'test',
        enable_notification: false,
        hasEmailVerified: true
      }
    }

    dispatchMock.mockReturnValue({unwrap: () => Promise.resolve(response)})
    
    fireEvent.input(screen.getByLabelText('Nome'), {
      target: {value: 'Test Changed'}
    })

    
    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'test2@test.com'}
    })

    fireEvent.submit(screen.getByRole("button", { name: "Alterar" }));

    await waitFor(() => {
      expect(screen.getByText("Sucesso")).toBeInTheDocument();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.getByText("Alteração realizada com sucesso")).toBeInTheDocument();
    })
  });

  it('failed when change user data', async () => {
    const response = {
      response: {
        status: 422,
        headers: {},
        statusText: "",
        config: {},
        data:{
          email: ["invalid email"],
        }
      }      
    }

    dispatchMock.mockReturnValue({unwrap: () => Promise.reject(response)})
    
    fireEvent.input(screen.getByLabelText('Nome'), {
      target: {value: 'Test Changed'}
    })
    
    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'test2@test.com'}
    })

    fireEvent.submit(screen.getByRole("button", { name: "Alterar" }));

    await waitFor(() => {
      expect(screen.getByText(response.response.data.email[0])).toBeInTheDocument();
    })
  });
})