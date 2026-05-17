import { render, screen } from "@/helpers/test/test-helper";
import TagsPopover from "../tags-popover";

describe("TagsPopover", () => {
  it("não renderiza nada quando tags é undefined", () => {
    const { container } = render(<TagsPopover tags={undefined as any} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("não renderiza nada quando tags é array vazio", () => {
    const { container } = render(<TagsPopover tags={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renderiza o botão quando há tags", () => {
    render(<TagsPopover tags={["alimentação", "lazer"]} />);
    expect(screen.getByRole("button", { name: "2 tags" })).toBeInTheDocument();
  });

  it("exibe aria-label no singular com 1 tag", () => {
    render(<TagsPopover tags={["alimentação"]} />);
    expect(screen.getByRole("button", { name: "1 tag" })).toBeInTheDocument();
  });

  it("aplica className extra quando fornecida", () => {
    render(<TagsPopover tags={["alimentação"]} className="minha-classe" />);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("minha-classe");
  });
});
