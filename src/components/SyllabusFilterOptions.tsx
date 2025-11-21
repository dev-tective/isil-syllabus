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
                        ? '#06b6d4' // cyan-500
                        : state.isFocused
                            ? '#22d3ee' // cyan-400 (hover)
                            : '#1f2937', // gray-800
                    color: '#ffffff',
                    cursor: 'pointer',
                    ':active': {
                        backgroundColor: '#0891b2' // cyan-600
                    }
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: '#1f2937', // gray-800
                }),
                multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#06b6d4', // cyan-500
                }),
                multiValueLabel: (base) => ({
                    ...base,
                    color: '#ffffff',
                }),
                multiValueRemove: (base) => ({
                    ...base,
                    color: '#ffffff',
                    ':hover': {
                        backgroundColor: '#0891b2', // cyan-600
                        color: '#ffffff',
                    }
                })
            }}
        />
    );
};

export default SyllabusFilterOptions;