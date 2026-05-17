import { render, waitFor } from '@testing-library/react';

import Page from '../page';

jest.mock('../resetar-senha', () => ({
  __esModule: true,
  ResetarSenha: () => <div>Mock ResetarSenhaPage</div>,
}));

describe('ResetarSenha page.tsx', () => {
  it('renderiza o suspense e o client component', async () => {
    render(<Page />);
    await waitFor(() => {
      expect(document.body.textContent).toContain('Mock ResetarSenhaPage');
    });
  });
});
