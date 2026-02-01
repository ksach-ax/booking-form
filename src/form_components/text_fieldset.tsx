import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { RiPhoneFill } from "react-icons/ri";
import { IoMdPerson } from "react-icons/io";
import { BiSolidCarGarage } from "react-icons/bi";

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
    placeholder?: string;
    iconName?: string;
    inputMode?:
        | "none"
        | "text"
        | "decimal"
        | "numeric"
        | "tel"
        | "search"
        | "email"
        | "url";
    addAsterisk?: boolean;
};

export function TextFieldset({
    legendText,
    labelText,
    inputClassName,
    labelClassName,
    registrationReturn,
    placeholder,
    iconName,
    inputMode,
    addAsterisk,
}: TextFieldsetProps) {
    let iconComponent: ReactNode;

    switch (iconName) {
        case "dealership":
            iconComponent = <BiSolidCarGarage className="text-lg" />;
            break;
        case "contact_name":
            iconComponent = <IoMdPerson className="text-lg" />;
            break;
        case "contact_phone":
            iconComponent = <RiPhoneFill className="text-lg" />;
            break;
        default:
            break;
    }

    return (
        <fieldset className="fieldset">
            <div className="flex items-center gap-2">
                {iconName && iconComponent}
                <legend className="fieldset-legend">
                    {legendText}
                    {addAsterisk && <span className="text-red-500">*</span>}
                </legend>
            </div>
            <input
                type="text"
                className={inputClassName}
                {...registrationReturn}
                placeholder={placeholder}
                inputMode={inputMode || "text"}
            />
            <Label className={labelClassName} textContent={labelText} />
        </fieldset>
    );
}
