import Select from "./primitives/select";
import { SelectItem } from "./primitives/select-item";
import Text from "./primitives/text";

type FiltroPorPaginaProps = {
  value: number;
  onChange: (value: number) => void;
}

export default function FiltroPorPagina({ value, onChange }: FiltroPorPaginaProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Select
        value={String(value)}
        className="md:w-22"
        onValueChange={(selectedValue) => onChange(Number(selectedValue))}
      >
        <SelectItem text="10" value="10" />
        <SelectItem text="25" value="25" />
        <SelectItem text="50" value="50" />
        <SelectItem text="100" value="100" />
      </Select>
      <Text variant="paragraph-small" className="hidden md:block md:font-semibold">Resultados por página</Text>
    </div>
  )
}