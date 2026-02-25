import { render, screen } from '@testing-library/react';

import CadastrarUsuario from '../page';

describe('CadastrarUsuario Page', () => {
  it('renderiza título e formulário', () => {
    render(<CadastrarUsuario />);

    expect(screen.getByText(/MEU DINHEIRIM/i)).toBeInTheDocument();
    expect(screen.getByText(/Cadastrar Usuário/i)).toBeInTheDocument();
  });

  it('renderiza botão de voltar', () => {
    render(<CadastrarUsuario />);
    const voltarBtn = screen.getByLabelText('Voltar');
    expect(voltarBtn).toBeInTheDocument();
  });

  it('renderiza o componente de formulário', () => {
    render(<CadastrarUsuario />);

    const [senhaInput, confirmaSenhaInput] = screen.getAllByLabelText(/Senha/i);

    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(senhaInput).toBeInTheDocument();
    expect(confirmaSenhaInput).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });
});
