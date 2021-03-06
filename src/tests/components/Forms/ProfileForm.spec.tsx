import { act } from "react-dom/test-utils";
import { fireEvent, render, screen, waitFor } from "../../../utils/test-utils";
import { mocked } from 'ts-jest/utils';
import { ProfileForm } from "../../../components/Foms/profile/ProfileForm";
import { profileService } from "../../../services/ApiService/ProfileService";

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

jest.mock('../../../services/ApiService/ProfileService')

describe('ProfileForm Component', () => {
  beforeEach(() => {
    render(<ProfileForm />)
  });
  
  it('validates required inputs', async () => {
    fireEvent.input(screen.getByLabelText('Nome'), {
      target: {value: ''}
    })

    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: ''}
    })

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Alterar" }));
    })
    
    expect(screen.getByRole("button")).not.toBeDisabled();
    expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("O campo email é obrigatório")).toBeInTheDocument();
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
    const getAuthServiceMocked = mocked(profileService.updateProfile);

    getAuthServiceMocked.mockResolvedValueOnce({
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
    })
    
    fireEvent.input(screen.getByLabelText('Nome'), {
      target: {value: 'Test Changed'}
    })

    
    fireEvent.input(screen.getByLabelText('E-mail'), {
      target: {value: 'test2@test.com'}
    })

    await waitFor(() => {
      fireEvent.submit(screen.getByRole("button", { name: "Alterar" }));
    })

    expect(screen.getByText("Alterar")).not.toBeDisabled();
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText("Alteração realizada com sucesso")).toBeInTheDocument();
  });

  it('send the data without any changes', async () => {
    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "Alterar" }));
    })

    expect(screen.getByText("Sem alteração")).toBeInTheDocument();
    expect(screen.getByText("Nenhuma alteração foi realizada")).toBeInTheDocument();
  });
  
})