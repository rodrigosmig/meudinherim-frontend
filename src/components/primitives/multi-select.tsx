import { ElementType, useId } from "react";
import ReactSelect from "react-select";

type MultiSelectProps = {
  options: { value: string; label: string }[];
  placeholder?: string;
  id?: string;
  label?: string;
  icon?: ElementType;
}

export default function MultiSelect({ options, placeholder = "Selecione", id, label, icon: Icon }: MultiSelectProps) {
  const triggerId = id ?? useId();

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={triggerId} className="mb-1">
          {label}
        </label>
      )
      }
      <div className="relative w-full">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-500 md:h-5 md:w-5" />}
        <ReactSelect
          inputId={triggerId}
          options={options}
          isMulti
          unstyled
          placeholder={placeholder}
          classNames={{
            container: () => "w-full",
            control: ({ isFocused }) =>
              [
                "flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2 text-base",
                "hover:bg-gray-900",
                "text-input-text",
                Icon ? "pl-10" : "",
                isFocused ? "border-default-border ring-2 ring-primary" : "border-default-border",
              ].join(" "),
            valueContainer: () => "gap-1 py-0",
            placeholder: () => "text-default-placeholder",
            input: () => "text-input-text m-0 p-0",
            multiValue: () => "bg-input-text/20 rounded-md",
            multiValueLabel: () => "text-input-text px-2 py-0.5 text-sm",
            multiValueRemove: () => "text-gray-300 hover:bg-primary hover:text-default-text rounded-r-md px-1",
            indicatorsContainer: () => "text-default-text",
            dropdownIndicator: () => "text-default-text",
            clearIndicator: () => "text-default-text",
            menu: () => "z-60 mt-1 overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-sm",
            menuList: () => "max-h-60 divide-y divide-line-separator overflow-y-auto",
            option: ({ isFocused, isSelected }) =>
              [
                "cursor-pointer bg-gray-700 px-3 py-2.5 text-xs md:text-base",
                isFocused || isSelected ? "bg-primary" : "",
              ].join(" "),
            noOptionsMessage: () => "px-3 py-2 text-gray-500",
          }}
        />
      </div>
    </div >
  )
}