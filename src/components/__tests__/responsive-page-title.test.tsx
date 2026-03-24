import { render, screen } from "@/helpers/test/test-helper";

import ResponsivePageTitle from "../header/responsive-page-title";

// Mocks
jest.mock("../primitives/heading", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
}));
jest.mock("../primitives/loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading" />,
}));
jest.mock("../primitives/text", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));
jest.mock("@/components/header/header", () => ({
  Header: {
    Title: ({ children }: any) => <div data-testid="header-title">{children}</div>,
  },
}));

describe("ResponsivePageTitle", () => {
  it("renderiza o título principal", () => {
    render(<ResponsivePageTitle title="Dashboard" />);
    expect(screen.getAllByText("Dashboard")).toHaveLength(2); // desktop e mobile
  });

  it("renderiza o loading quando isLoading=true", () => {
    render(<ResponsivePageTitle title="Dashboard" isLoading />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renderiza métricas quando metricLabel e metricValue são passados", () => {
    render(
      <ResponsivePageTitle
        title="Dashboard"
        metricLabel="Total"
        metricValue="R$ 1000"
      />
    );
    expect(screen.getAllByText("Total")).toHaveLength(2); // desktop e mobile
    expect(screen.getAllByText("R$ 1000")).toHaveLength(2); // desktop e mobile
  });

  it("aplica metricValueClassName corretamente", () => {
    render(
      <ResponsivePageTitle
        title="Dashboard"
        metricLabel="Total"
        metricValue="R$ 1000"
        metricValueClassName="text-green-500"
      />
    );
    // desktop metric value
    expect(screen.getAllByText("R$ 1000")[0]).toHaveClass("text-green-500");
  });

  it("aplica className no wrapper do título", () => {
    render(<ResponsivePageTitle title="Dashboard" className="custom-class" />);
    const wrapper = screen.getByTestId("header-title").querySelector("div");
    expect(wrapper).toHaveClass("custom-class");
  });
});
