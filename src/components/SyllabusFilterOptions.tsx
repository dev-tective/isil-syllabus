import Select, { type MultiValue } from "react-select";
import { useState } from "react";

export interface OptionType {
    value: string;
    label: string;
}

interface Props {
    placeholder: string;
    options: OptionType[];
    setFilterValue: (values: OptionType[]) => void;
}

const SyllabusFilterOptions = ({ options, setFilterValue, placeholder } : Props) => {
    const [values, setValues] = useState<OptionType[]>([])

    const handleChange = (newValue: MultiValue<OptionType>) => {
        const selectedValues = Array.from(newValue);
        setValues(selectedValues);
        setFilterValue(selectedValues);
    };

    return (
        <Select
            className={'bg-gray-600 rounded-4xl min-w-32 capitalize'}
            isMulti
            options={options}
            value={values}
            onChange={handleChange}
            placeholder={placeholder}
            styles={{
                control: (base) => ({
                    ...base,
                    backgroundColor: '#4a5565',
                    border: 'none',
                    boxShadow: 'none',
                    ':hover': {
                        border: 'none',
                    }
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                        ? '#3b82f6' // blue-500
                        : state.isFocused
                            ? '#60a5fa' // blue-400 (hover)
                            : '#1f2937', // gray-800
                    color: '#ffffff',
                    cursor: 'pointer',
                    ':active': {
                        backgroundColor: '#2563eb' // blue-600
                    }
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937', // gray-800
                }),
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#3b82f6', // blue-500
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: '#ffffff',
                }),
                multiValueRemove: (base) => ({
                    ...base,
                    color: '#ffffff',
                    ':hover': {
                        backgroundColor: '#2563eb', // blue-600
                        color: '#ffffff',
                    }
                })
            }}
        />
    );
};

export default SyllabusFilterOptions;