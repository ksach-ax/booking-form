import type { UseFormRegisterReturn } from "react-hook-form";

type LabelProps = {
    className: string;
    textContent: string;
};

function Label(props: LabelProps) {
    const { className, textContent } = props;

    return <p className={className}>{textContent}</p>;
}

type TextFieldsetProps = {
    legendText: string;
    labelText: string;
    inputClassName: string;
    labelClassName: string;
    registrationReturn: UseFormRegisterReturn;
};

export function TextFieldset({
    legendText,
    labelText,
    inputClassName,
    labelClassName,
    registrationReturn,
}: TextFieldsetProps) {
    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">{legendText}</legend>
            <input
                type="text"
                className={inputClassName}
                {...registrationReturn}
            />
            <Label className={labelClassName} textContent={labelText} />
        </fieldset>
    );
}
