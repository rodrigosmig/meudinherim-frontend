import { Select } from "./primitives/select";
import Text from "./primitives/text";

type FiltroPorPaginaProps = {
  value: number;
  onChange: (value: number) => void;
}

export default function FiltroPorPagina({ value, onChange }: FiltroPorPaginaProps) {
  return (
    <div className="flex items-center gap-2 text-default-text">
      <Select.Root
        value={String(value)}
        className="md:w-22 text-xs md:text-sm h-full"
        onValueChange={(selectedValue) => onChange(Number(selectedValue))}
      >
        <Select.Item text="10" value="10" />
        <Select.Item text="25" value="25" />
        <Select.Item text="50" value="50" />
        <Select.Item text="100" value="100" />
      </Select.Root>
      <Text variant="paragraph-small" className="hidden md:block md:font-semibold">Resultados por página</Text>
    </div>
  )
}