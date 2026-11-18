import { useState } from "react";

import { fireEvent, render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import { GroupedOption, Select } from "../primitives/select";

// jsdom reporta suporte a TouchEvent, o que faz o react-select usar
// blurInputOnSelect=true e fechar o menu sozinho. Desligamos esse caminho para
// que os testes provem o fechamento por closeMenuOnSelect.
jest.mock("react-select", () => {
  const createEvent = document.createEvent.bind(document);

  document.createEvent = ((eventInterface: string) => {
    if (eventInterface === "TouchEvent") {
      throw new Error("TouchEvent não suportado neste teste");
    }

    return createEvent(eventInterface);
  }) as typeof document.createEvent;

  return jest.requireActual("react-select");
});

const OPTION_HEIGHT = 44;
const LIST_HEIGHT = 300;

const MANY_OPTIONS = Array.from({ length: 30 }, (_, index) => ({
  value: `opcao-${index + 1}`,
  label: `Opção ${index + 1}`,
}));

const GROUPED_OPTIONS: GroupedOption[] = [
  { label: "Entrada", options: MANY_OPTIONS.slice(0, 15) },
  { label: "Saída", options: MANY_OPTIONS.slice(15) },
];

const TAGS = [
  { value: "alimentacao", label: "Alimentação" },
  { value: "transporte", label: "Transporte" },
];

const layoutDescriptors = {
  offsetTop: Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetTop"),
  clientHeight: Object.getOwnPropertyDescriptor(Element.prototype, "clientHeight"),
  scrollHeight: Object.getOwnPropertyDescriptor(Element.prototype, "scrollHeight"),
};

function instalarMetricasDeLayout() {
  Object.defineProperty(HTMLElement.prototype, "offsetTop", {
    configurable: true,
    get() {
      const numero = /^Opção (\d+)$/.exec((this.textContent ?? "").trim())?.[1];
      return numero ? (Number(numero) - 1) * OPTION_HEIGHT : 0;
    },
  });

  Object.defineProperty(Element.prototype, "clientHeight", {
    configurable: true,
    get() {
      return this.getAttribute("role") === "listbox" ? LIST_HEIGHT : OPTION_HEIGHT;
    },
  });

  Object.defineProperty(Element.prototype, "scrollHeight", {
    configurable: true,
    get() {
      if (this.getAttribute("role") !== "listbox") return 0;
      return this.querySelectorAll('[role="option"]').length * OPTION_HEIGHT;
    },
  });
}

function restaurarMetricasDeLayout() {
  Object.defineProperty(HTMLElement.prototype, "offsetTop", layoutDescriptors.offsetTop!);
  Object.defineProperty(Element.prototype, "clientHeight", layoutDescriptors.clientHeight!);
  Object.defineProperty(Element.prototype, "scrollHeight", layoutDescriptors.scrollHeight!);
}

function scrollEsperado(numeroDaOpcao: number) {
  const centralizado =
    (numeroDaOpcao - 1) * OPTION_HEIGHT - LIST_HEIGHT / 2 + OPTION_HEIGHT / 2;
  const maximo = MANY_OPTIONS.length * OPTION_HEIGHT - LIST_HEIGHT;

  return Math.min(Math.max(0, centralizado), maximo);
}

async function abrirMenu(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("combobox"));

  return screen.findByRole("listbox");
}

beforeEach(instalarMetricasDeLayout);
afterEach(restaurarMetricasDeLayout);

describe("Select - abertura do menu", () => {
  it("abre com a opção selecionada visível no centro da lista", async () => {
    const user = userEvent.setup();
    render(<Select options={MANY_OPTIONS} value="opcao-20" />);

    const listbox = await abrirMenu(user);

    await waitFor(() => expect(listbox.scrollTop).toBe(scrollEsperado(20)));
  });

  it("mantém a lista no início quando não há valor selecionado", async () => {
    const user = userEvent.setup();
    render(<Select options={MANY_OPTIONS} />);

    const listbox = await abrirMenu(user);

    await waitFor(() => expect(listbox).toBeInTheDocument());
    expect(listbox.scrollTop).toBe(0);
  });

  it("mantém a lista no início quando o valor não existe nas opções", async () => {
    const user = userEvent.setup();
    render(<Select options={MANY_OPTIONS} value="opcao-inexistente" />);

    const listbox = await abrirMenu(user);

    await waitFor(() => expect(listbox).toBeInTheDocument());
    expect(listbox.scrollTop).toBe(0);
  });

  it("exibe a nova opção selecionada ao reabrir o menu", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <Select options={MANY_OPTIONS} value="opcao-5" />,
    );

    const primeiraLista = await abrirMenu(user);
    await waitFor(() =>
      expect(primeiraLista.scrollTop).toBe(scrollEsperado(5)),
    );

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument(),
    );

    rerender(<Select options={MANY_OPTIONS} value="opcao-25" />);

    const segundaLista = await abrirMenu(user);
    await waitFor(() =>
      expect(segundaLista.scrollTop).toBe(scrollEsperado(25)),
    );
  });

  it("localiza a opção selecionada em um grupo de opções", async () => {
    const user = userEvent.setup();
    render(<Select options={GROUPED_OPTIONS} value="opcao-25" />);

    const listbox = await abrirMenu(user);

    await waitFor(() => expect(listbox.scrollTop).toBe(scrollEsperado(25)));
  });

  it("limita a rolagem ao fim da lista quando a última opção está selecionada", async () => {
    const user = userEvent.setup();
    render(<Select options={MANY_OPTIONS} value="opcao-30" />);

    const listbox = await abrirMenu(user);

    await waitFor(() => expect(listbox.scrollTop).toBe(scrollEsperado(30)));
    expect(scrollEsperado(30)).toBe(
      MANY_OPTIONS.length * OPTION_HEIGHT - LIST_HEIGHT,
    );
  });
});

function SelectDeTagsControlado({ onChange }: { onChange: jest.Mock }) {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Select
      isMulti
      options={TAGS}
      value={value}
      onChange={(novoValor) => {
        const valores = novoValor as string[];
        setValue(valores);
        onChange(valores);
      }}
    />
  );
}

function SelectDeTagsCriavel({ onChange }: { onChange: jest.Mock }) {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Select
      isMulti
      isCreatable
      options={TAGS}
      value={value}
      onChange={(novoValor) => {
        const valores = novoValor as string[];
        setValue(valores);
        onChange(valores);
      }}
    />
  );
}

describe("Select - navegação por teclado", () => {
  it("avança o foco para o próximo campo ao pressionar Tab", () => {
    render(
      <>
        <Select options={TAGS} value="alimentacao" />
        <input data-testid="proximo" />
      </>,
    );

    const combobox = screen.getByRole("combobox");
    const proximo = screen.getByTestId("proximo");

    combobox.focus();
    fireEvent.focusOut(combobox, { relatedTarget: proximo });

    expect(proximo).toHaveFocus();
  });

  it("volta o foco para o campo anterior ao pressionar Shift+Tab", () => {
    render(
      <>
        <input data-testid="anterior" />
        <Select options={TAGS} value="alimentacao" />
      </>,
    );

    const combobox = screen.getByRole("combobox");
    const anterior = screen.getByTestId("anterior");

    combobox.focus();
    fireEvent.focusOut(combobox, { relatedTarget: anterior });

    expect(anterior).toHaveFocus();
  });

  it("não move o foco quando o blur não tem relatedTarget", () => {
    render(
      <>
        <Select options={TAGS} value="alimentacao" />
        <input data-testid="proximo" />
      </>,
    );

    const combobox = screen.getByRole("combobox");
    const proximo = screen.getByTestId("proximo");

    combobox.focus();
    fireEvent.focusOut(combobox);

    expect(combobox).toHaveFocus();
    expect(proximo).not.toHaveFocus();
  });

  it("preserva a chamada de onBlur do consumidor", () => {
    const onBlur = jest.fn();

    render(
      <>
        <Select options={TAGS} value="alimentacao" onBlur={onBlur} />
        <input data-testid="proximo" />
      </>,
    );

    const combobox = screen.getByRole("combobox");

    combobox.focus();
    fireEvent.focusOut(combobox, {
      relatedTarget: screen.getByTestId("proximo"),
    });

    expect(onBlur).toHaveBeenCalled();
  });
});

describe("Select - fechamento do menu de tags", () => {
  it("fecha o menu ao selecionar uma opção com o mouse", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<SelectDeTagsControlado onChange={onChange} />);

    await abrirMenu(user);
    fireEvent.click(screen.getByRole("option", { name: "Alimentação" }));

    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument(),
    );
    expect(onChange).toHaveBeenCalledWith(["alimentacao"]);
    expect(screen.getByText("Alimentação")).toBeInTheDocument();
  });

  it("fecha o menu ao selecionar uma opção com o teclado", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<SelectDeTagsControlado onChange={onChange} />);

    await abrirMenu(user);
    await user.keyboard("{Enter}");

    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument(),
    );
    expect(onChange).toHaveBeenCalledWith(["alimentacao"]);
    expect(screen.getByText("Alimentação")).toBeInTheDocument();
  });

  it("fecha o menu ao criar uma tag nova", async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<SelectDeTagsCriavel onChange={onChange} />);

    await abrirMenu(user);
    await user.keyboard("nova");
    fireEvent.click(screen.getByRole("option", { name: 'Criar "nova"' }));

    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument(),
    );
    expect(onChange).toHaveBeenCalledWith(["nova"]);
    expect(screen.getByText("nova")).toBeInTheDocument();
  });
});
