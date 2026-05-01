import ReactSelect, { MultiValue, SingleValue } from "react-select";
import { FieldError } from "react-hook-form";
import { ElementType, useId } from "react";

import Text from "./text";

export interface SelectOption {
  value: string;
  label: string;
}

export interface GroupedOption {
  label: string;
  options: SelectOption[];
}

type MultiSelectProps = {
  options: SelectOption[] | GroupedOption[];
  placeholder?: string;
  id?: string;
  label?: string;
  error?: FieldError;
  icon?: ElementType;
  isMulti?: boolean;
  value?: string[] | string;
  onChange?: (values: string[] | string | undefined) => void;
  onBlur?: () => void;
  name?: string;
  disabled?: boolean;
}

export function Select({
  options,
  placeholder = "Selecione",
  id,
  label,
  error,
  icon: Icon,
  isMulti = false,
  value,
  onChange,
  onBlur,
  name,
  disabled = false,
}: MultiSelectProps) {
  const triggerId = id ?? useId();
  const isError = !!error;

  const isGroupedOptions = (items: SelectOption[] | GroupedOption[]): items is GroupedOption[] => {
    const firstItem = items[0];
    return !!firstItem && "options" in firstItem;
  };

  const flatOptions = isGroupedOptions(options)
    ? options.flatMap((group) => group.options)
    : options;

  const selectedValue = isMulti
    ? flatOptions.filter((option) => Array.isArray(value) && value.includes(option.value))
    : flatOptions.find((option) => option.value === value) ?? null;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={triggerId}
          className={`mb-1${disabled ? " opacity-50 cursor-not-allowed" : ""}`}
        >
          {label}
        </label>
      )}
      <div className="relative z-0 w-full focus-within:z-80">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 z-1 h-4 w-4 -translate-y-1/2 text-gray-500 md:h-5 md:w-5" />}
        <ReactSelect<SelectOption, boolean>
          inputId={triggerId}
          options={options}
          isMulti={isMulti}
          isDisabled={disabled}
          unstyled
          menuPlacement="auto"
          menuPosition="fixed"
          name={name}
          value={selectedValue}
          onBlur={onBlur}
          closeMenuOnSelect={!isMulti}
          onChange={(selected: MultiValue<SelectOption> | SingleValue<SelectOption>) => {
            if (isMulti) {
              const selectedValues = (selected as MultiValue<SelectOption> ?? []).map((option) => option.value);
              onChange?.(selectedValues);
              return;
            }

            const selectedValue = (selected as SingleValue<SelectOption>)?.value;
            onChange?.(selectedValue);
          }}
          placeholder={placeholder}
          classNames={{
            container: () => "w-full",
            control: ({ isFocused, isDisabled }) =>
              [
                "flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs md:text-base",
                Icon ? "pl-10" : "",
                isDisabled
                  ? "bg-gray-800/40 border-gray-700/40 opacity-60 cursor-not-allowed"
                  : [
                      "bg-card hover:bg-gray-900 text-input-text",
                      isError
                        ? isFocused
                          ? "border-red-400 ring-2 ring-red-400"
                          : "border-red-400"
                        : isFocused
                          ? "border-default-border ring-2 ring-primary"
                          : "border-default-border",
                    ].join(" "),
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
            menu: () => "z-[90] mt-1 overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-sm",
            menuList: () => "max-h-60 divide-y divide-line-separator overflow-y-auto",
            groupHeading: () => "bg-gray-700 px-3 py-2.5 text-xs font-medium text-gray-500 md:text-lg italic",
            option: ({ isFocused, isSelected }) =>
              [
                "cursor-pointer bg-gray-700 px-3 py-2.5 text-xs md:text-base",
                isFocused || isSelected ? "bg-primary" : "",
              ].join(" "),
            noOptionsMessage: () => "px-3 py-2 text-gray-500",
          }}
        />
      </div>
      {!!isError && (
        <Text className="pt-1 text-sm text-error">
          {error.message?.toString()}
        </Text>
      )}
    </div >
  )
}