import userEvent from "@testing-library/user-event";

import InputDate from "@/components/primitives/input-date";
import { render, screen, waitFor } from "@/helpers/test/test-helper";

function dia(nome: RegExp) {
  return screen.getByRole("button", { name: nome });
}

function dias(nome: RegExp) {
  return screen.queryAllByRole("button", { name: nome });
}

describe("InputDate", () => {
  describe("dia já selecionado", () => {
    it("mantém a data ao clicar no dia já selecionado", async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      render(<InputDate label="Data" dateSelected={new Date(2026, 11, 30)} onChange={onChange} />);

      await user.click(screen.getByDisplayValue("30/12/2026"));
      await user.click(dia(/30 de dezembro de 2026/));

      expect(onChange).toHaveBeenCalledTimes(1);
      const [data] = onChange.mock.calls[0];
      expect(data).toBeInstanceOf(Date);
      expect(data.getFullYear()).toBe(2026);
      expect(data.getMonth()).toBe(11);
      expect(data.getDate()).toBe(30);
    });

    it("fecha o calendário ao clicar no dia já selecionado", async () => {
      const user = userEvent.setup();
      render(<InputDate label="Data" dateSelected={new Date(2026, 11, 30)} onChange={jest.fn()} />);

      await user.click(screen.getByDisplayValue("30/12/2026"));
      await user.click(dia(/30 de dezembro de 2026/));

      await waitFor(() => {
        expect(dias(/30 de dezembro de 2026/)).toHaveLength(0);
      });
    });
  });

  describe("mês inicial", () => {
    it("abre no mês da data selecionada", async () => {
      const user = userEvent.setup();
      render(<InputDate label="Data" dateSelected={new Date(2026, 11, 30)} onChange={jest.fn()} />);

      await user.click(screen.getByDisplayValue("30/12/2026"));

      expect(dia(/30 de dezembro de 2026/)).toBeInTheDocument();
      expect(screen.getAllByRole("combobox")[0]).toHaveValue("11");
      expect(screen.getAllByRole("combobox")[1]).toHaveValue("2026");
    });

    it("volta ao mês da data ao reabrir", async () => {
      const user = userEvent.setup();
      render(<InputDate label="Data" dateSelected={new Date(2026, 11, 30)} onChange={jest.fn()} />);
      const campo = screen.getByDisplayValue("30/12/2026");

      await user.click(campo);
      await user.selectOptions(screen.getAllByRole("combobox")[0], "0");
      expect(dia(/30 de janeiro de 2026/)).toBeInTheDocument();

      await user.keyboard("{Escape}");
      await waitFor(() => expect(dias(/30 de janeiro de 2026/)).toHaveLength(0));

      await user.click(campo);
      expect(dia(/30 de dezembro de 2026/)).toBeInTheDocument();
    });

    it("abre no mês atual sem data selecionada", async () => {
      const user = userEvent.setup();
      const hoje = new Date();
      render(<InputDate label="Data" onChange={jest.fn()} />);

      await user.click(screen.getByPlaceholderText("Selecione uma data"));

      expect(screen.getAllByRole("combobox")[0]).toHaveValue(String(hoje.getMonth()));
      expect(screen.getAllByRole("combobox")[1]).toHaveValue(String(hoje.getFullYear()));
    });
  });
});
