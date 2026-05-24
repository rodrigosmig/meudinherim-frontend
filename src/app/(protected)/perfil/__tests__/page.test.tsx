import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";
import PerfilPage from "../page";

const mockedPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockedPush }),
}));

const mockUpdateUsuario = jest.fn();
const mockLogout = jest.fn();
const mockUsuario = {
  id: "1",
  nome: "Rodrigo Miguel",
  email: "rodrigo@email.com",
  ativaNotificacao: true,
  avatar: "",
};

jest.mock("@/contexts/auth-context", () => ({
  useAuth: () => ({
    usuario: mockUsuario,
    updateUsuario: mockUpdateUsuario,
    logout: mockLogout,
  }),
}));

const mockAlterarPerfil = jest.fn();
const mockAlterarSenha = jest.fn();
const mockAlterarImagem = jest.fn();

jest.mock("@/services/usuario-service", () => ({
  usuarioService: {
    alterarPerfil: (...args: any[]) => mockAlterarPerfil(...args),
    alterarSenha: (...args: any[]) => mockAlterarSenha(...args),
    alterarImagem: (...args: any[]) => mockAlterarImagem(...args),
  },
}));

jest.mock("@/components/header/responsive-page-title", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock("@/components/avatar", () => ({
  Avatar: ({ name, src }: { name: string; src?: string }) => (
    <img alt={`Avatar de ${name}`} src={src ?? ""} />
  ),
}));

describe("PerfilPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAlterarPerfil.mockResolvedValue({
      data: { usuario: { ...mockUsuario, nome: "Rodrigo Atualizado" } },
    });
    mockAlterarSenha.mockResolvedValue({});
    mockAlterarImagem.mockResolvedValue({ data: { urlAvatar: "http://img.com/avatar.jpg" } });
  });

  it("renderiza o título da página", () => {
    render(<PerfilPage />);
    expect(screen.getByText("Meu Perfil")).toBeInTheDocument();
  });

  it("renderiza as abas Perfil e Senha", () => {
    render(<PerfilPage />);
    const tabs = screen.getAllByRole("button", { name: /Perfil/i });
    expect(tabs.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("button", { name: /^Senha$/i })).toBeInTheDocument();
  });

  it("exibe a aba Perfil por padrão", () => {
    render(<PerfilPage />);
    expect(screen.getByPlaceholderText("Seu nome")).toBeInTheDocument();
  });

  it("preenche o formulário com os dados do usuário", () => {
    render(<PerfilPage />);
    expect(screen.getByDisplayValue("Rodrigo Miguel")).toBeInTheDocument();
    expect(screen.getByDisplayValue("rodrigo@email.com")).toBeInTheDocument();
  });

  it("troca para a aba Senha ao clicar", async () => {
    const user = userEvent.setup();
    render(<PerfilPage />);
    await user.click(screen.getByRole("button", { name: /Senha/i }));
    expect(screen.getByPlaceholderText("Digite sua senha atual")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mínimo 8 caracteres")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repita a nova senha")).toBeInTheDocument();
  });

  it("campo email começa desabilitado", () => {
    render(<PerfilPage />);
    const emailInput = screen.getByDisplayValue("rodrigo@email.com");
    expect(emailInput).toBeDisabled();
  });

  it("habilita campo email ao clicar em 'Alterar e-mail'", async () => {
    const user = userEvent.setup();
    render(<PerfilPage />);
    await user.click(screen.getByText("Alterar e-mail"));
    const emailInput = screen.getByDisplayValue("rodrigo@email.com");
    expect(emailInput).not.toBeDisabled();
  });

  it("exibe aviso de confirmação ao desbloquear email", async () => {
    const user = userEvent.setup();
    render(<PerfilPage />);
    await user.click(screen.getByText("Alterar e-mail"));
    expect(screen.getByText(/link de confirmação/i)).toBeInTheDocument();
  });

  it("salva perfil com sucesso", async () => {
    const user = userEvent.setup();
    render(<PerfilPage />);
    const nomeInput = screen.getByDisplayValue("Rodrigo Miguel");
    await user.clear(nomeInput);
    await user.type(nomeInput, "Rodrigo Editado");
    await user.click(screen.getByRole("button", { name: /Salvar alterações/i }));
    await waitFor(() => {
      expect(mockAlterarPerfil).toHaveBeenCalledWith(
        expect.objectContaining({ nome: "Rodrigo Editado", email: "rodrigo@email.com" }),
      );
    });
  });

  it("atualiza contexto após salvar perfil", async () => {
    const user = userEvent.setup();
    render(<PerfilPage />);
    const nomeInput = screen.getByDisplayValue("Rodrigo Miguel");
    await user.clear(nomeInput);
    await user.type(nomeInput, "Rodrigo Editado");
    await user.click(screen.getByRole("button", { name: /Salvar alterações/i }));
    await waitFor(() => {
      expect(mockUpdateUsuario).toHaveBeenCalled();
    });
  });

  describe("botão Salvar alterações", () => {
    it("começa desabilitado", () => {
      render(<PerfilPage />);
      expect(screen.getByRole("button", { name: /Salvar alterações/i })).toBeDisabled();
    });

    it("é habilitado ao alterar o nome", async () => {
      const user = userEvent.setup();
      render(<PerfilPage />);
      const nomeInput = screen.getByDisplayValue("Rodrigo Miguel");
      await user.clear(nomeInput);
      await user.type(nomeInput, "Novo Nome");
      expect(screen.getByRole("button", { name: /Salvar alterações/i })).not.toBeDisabled();
    });

    it("é habilitado ao alterar o e-mail desbloqueado", async () => {
      const user = userEvent.setup();
      render(<PerfilPage />);
      await user.click(screen.getByText("Alterar e-mail"));
      const emailInput = screen.getByDisplayValue("rodrigo@email.com");
      await user.clear(emailInput);
      await user.type(emailInput, "novo@email.com");
      expect(screen.getByRole("button", { name: /Salvar alterações/i })).not.toBeDisabled();
    });

    it("é habilitado ao alternar a notificação", async () => {
      const user = userEvent.setup();
      render(<PerfilPage />);
      await user.click(screen.getByRole("switch", { name: /Receber notificações/i }));
      expect(screen.getByRole("button", { name: /Salvar alterações/i })).not.toBeDisabled();
    });

    it("volta a ser desabilitado após salvar com sucesso", async () => {
      const user = userEvent.setup();
      render(<PerfilPage />);
      const nomeInput = screen.getByDisplayValue("Rodrigo Miguel");
      await user.clear(nomeInput);
      await user.type(nomeInput, "Rodrigo Editado");
      await user.click(screen.getByRole("button", { name: /Salvar alterações/i }));
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Salvar alterações/i })).toBeDisabled();
      });
    });
  });

  it("exibe link 'Alterar foto'", () => {
    render(<PerfilPage />);
    expect(screen.getByText("Alterar foto")).toBeInTheDocument();
  });

  it("altera senha com sucesso", async () => {
    const user = userEvent.setup();
    render(<PerfilPage />);
    await user.click(screen.getByRole("button", { name: /Senha/i }));
    await user.type(screen.getByPlaceholderText("Digite sua senha atual"), "senhaAtual1");
    await user.type(screen.getByPlaceholderText("Mínimo 8 caracteres"), "novaSenha1");
    await user.type(screen.getByPlaceholderText("Repita a nova senha"), "novaSenha1");
    await user.click(screen.getByRole("button", { name: /Alterar senha/i }));
    await waitFor(() => {
      expect(mockAlterarSenha).toHaveBeenCalledWith({
        senhaAtual: "senhaAtual1",
        novaSenha: "novaSenha1",
        novaSenhaConfirmacao: "novaSenha1",
      });
    });
  });

  it("não submete senha se confirmação não bate", async () => {
    const user = userEvent.setup();
    render(<PerfilPage />);
    await user.click(screen.getByRole("button", { name: /Senha/i }));
    await user.type(screen.getByPlaceholderText("Digite sua senha atual"), "senhaAtual1");
    await user.type(screen.getByPlaceholderText("Mínimo 8 caracteres"), "novaSenha1");
    await user.type(screen.getByPlaceholderText("Repita a nova senha"), "outraSenha");
    await user.click(screen.getByRole("button", { name: /Alterar senha/i }));
    await waitFor(() => {
      expect(mockAlterarSenha).not.toHaveBeenCalled();
    });
    expect(screen.getByText("As senhas não coincidem")).toBeInTheDocument();
  });

  it("exibe erro de validação quando nome está vazio", async () => {
    const user = userEvent.setup();
    render(<PerfilPage />);
    const nomeInput = screen.getByDisplayValue("Rodrigo Miguel");
    await user.clear(nomeInput);
    await user.click(screen.getByRole("button", { name: /Salvar alterações/i }));
    await waitFor(() => {
      expect(screen.getByText("O campo nome é obrigatório")).toBeInTheDocument();
    });
    expect(mockAlterarPerfil).not.toHaveBeenCalled();
  });

  it("toggle mostrar/ocultar senha atual", async () => {
    const user = userEvent.setup();
    render(<PerfilPage />);
    await user.click(screen.getByRole("button", { name: /Senha/i }));
    const senhaInput = screen.getByPlaceholderText("Digite sua senha atual");
    expect(senhaInput).toHaveAttribute("type", "password");

    const toggleButtons = screen.getAllByLabelText("Mostrar senha");
    await user.click(toggleButtons[0]);
    expect(senhaInput).toHaveAttribute("type", "text");
  });
});
