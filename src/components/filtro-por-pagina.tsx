import { Select } from "./primitives/select";
import Text from "./primitives/text";

type FiltroPorPaginaProps = {
  value: number;
  onChange: (value: number) => void;
}

export default function FiltroPorPagina({ value, onChange }: FiltroPorPaginaProps) {
  const options = [{
    value: "10",
    label: "10",
  }, {
    value: "25",
    label: "25",
  }, {
    value: "50",
    label: "50",
  }, {
    value: "100",
    label: "100",
  }];

  return (
    <div className="flex items-center gap-2 text-default-text">
      <Select
        options={options}
        value={String(value)}
        onChange={(selectedValue) => onChange(Number(selectedValue))}
      />
      <Text variant="paragraph-small" className="hidden md:block md:font-semibold">Resultados por página</Text>
    </div>
  )
}