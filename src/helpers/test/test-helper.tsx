import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

function customRender(
  ui: ReactElement,
  options?: RenderOptions,
) {
  return render(ui, options);
}

export * from "@testing-library/react";
export { customRender as render };

