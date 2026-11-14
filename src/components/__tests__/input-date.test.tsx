import fs from "node:fs";
import path from "node:path";

import userEvent from "@testing-library/user-event";
import { format } from "date-fns";

import InputDate from "@/components/primitives/input-date";
import { render, screen, waitFor } from "@/helpers/test/test-helper";

function dia(nome: RegExp) {
  return screen.getByRole("button", { name: nome });
}

function dias(nome: RegExp) {
  return screen.queryAllByRole("button", { name: nome });
}

function regrasCss() {
  const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, seletor, corpo]) => ({
    seletor: seletor.trim(),
    corpo,
  }));
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

    it("abre no mês da data selecionada em outro ano", async () => {
      const user = userEvent.setup();
      render(<InputDate label="Data" dateSelected={new Date(2027, 0, 11)} onChange={jest.fn()} />);

      await user.click(screen.getByDisplayValue("11/01/2027"));

      expect(dia(/11 de janeiro de 2027/)).toBeInTheDocument();
      expect(screen.getAllByRole("combobox")[0]).toHaveValue("0");
      expect(screen.getAllByRole("combobox")[1]).toHaveValue("2027");
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

  describe("pista do dia correspondente", () => {
    it("destaca o mesmo dia do mês ao navegar", async () => {
      const user = userEvent.setup();
      render(<InputDate label="Data" dateSelected={new Date(2026, 10, 11)} onChange={jest.fn()} />);

      await user.click(screen.getByDisplayValue("11/11/2026"));
      await user.selectOptions(screen.getAllByRole("combobox")[0], "11");

      expect(dia(/11 de dezembro de 2026/).closest("td")).toHaveClass("rdp-same-day-of-month");
      expect(dia(/12 de dezembro de 2026/).closest("td")).not.toHaveClass("rdp-same-day-of-month");

      const regra = regrasCss().find(({ seletor }) =>
        seletor.includes(".rdp-same-day-of-month"),
      );
      expect(regra?.seletor).toContain(".periodo-day-picker");
      expect(regra?.seletor).not.toContain(".periodo-day-picker-input-date");
      expect(regra?.corpo).toContain("box-shadow: inset 0 0 0 1px var(--color-purple-400)");
      expect(regra?.corpo).not.toContain("background-color");
    });

    it("não aplica a pista no mês da data selecionada", async () => {
      const user = userEvent.setup();
      render(<InputDate label="Data" dateSelected={new Date(2026, 10, 11)} onChange={jest.fn()} />);

      await user.click(screen.getByDisplayValue("11/11/2026"));

      const diaSelecionado = dia(/11 de novembro de 2026/).closest("td");
      expect(diaSelecionado).toHaveClass("rdp-selected");
      expect(document.querySelectorAll("td.rdp-same-day-of-month")).toHaveLength(0);
    });

    it("não destaca dia inexistente no mês exibido", async () => {
      const user = userEvent.setup();
      render(<InputDate label="Data" dateSelected={new Date(2026, 0, 31)} onChange={jest.fn()} />);

      await user.click(screen.getByDisplayValue("31/01/2026"));
      await user.selectOptions(screen.getAllByRole("combobox")[0], "1");

      expect(dias(/1 de fevereiro de 2026/).length).toBeGreaterThan(0);
      expect(document.querySelectorAll("td.rdp-same-day-of-month")).toHaveLength(0);
    });
  });

  describe("dia de hoje", () => {
    it("destaca o dia de hoje com fundo circular", async () => {
      const user = userEvent.setup();
      render(<InputDate label="Data" onChange={jest.fn()} />);

      await user.click(screen.getByPlaceholderText("Selecione uma data"));

      expect(document.querySelector("td.rdp-today")).not.toBeNull();
      const regra = regrasCss().find(({ seletor, corpo }) =>
        seletor.includes(".rdp-today") && corpo.includes("background-color"),
      );
      expect(regra?.seletor).toContain(".periodo-day-picker");
      expect(regra?.seletor).toContain(".rdp-day_button");
      expect(regra?.corpo).toContain("background-color: rgb(103 89 244 / 0.18)");
      expect(regra?.corpo).toContain("color: var(--color-purple-200)");
    });

    it("mantém o estilo de selecionado quando hoje está selecionado", async () => {
      const user = userEvent.setup();
      const hoje = new Date();
      render(<InputDate label="Data" dateSelected={hoje} onChange={jest.fn()} />);

      await user.click(screen.getByDisplayValue(format(hoje, "dd/MM/yyyy")));

      expect(document.querySelector("td.rdp-today")).toHaveClass("rdp-selected");
      const regra = regrasCss().find(({ seletor, corpo }) =>
        seletor.includes(".rdp-today") && corpo.includes("background-color"),
      );
      expect(regra?.seletor).toContain(":not(.rdp-selected)");
    });

    it("aplica o destaque de hoje no escopo compartilhado dos calendários", () => {
      const regra = regrasCss().find(({ seletor, corpo }) =>
        seletor.includes(".rdp-today") && corpo.includes("background-color"),
      );
      expect(regra?.seletor).toContain(".periodo-day-picker");
      expect(regra?.seletor).not.toContain(".periodo-day-picker-input-date");
    });
  });
});
