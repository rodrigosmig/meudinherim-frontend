import { render, screen, waitFor } from "@/helpers/test/test-helper";
import userEvent from "@testing-library/user-event";

import { GroupedOption, Select } from "../primitives/select";

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
