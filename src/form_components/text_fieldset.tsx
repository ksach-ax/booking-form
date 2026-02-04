import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { RiPhoneFill } from "react-icons/ri";
import { IoMdPerson } from "react-icons/io";
import { BiSolidCalendarAlt, BiSolidCarGarage, BiSolidReceipt } from "react-icons/bi";
import { HiMiniDocumentCheck } from "react-icons/hi2";
import { PiPaintBucketFill } from "react-icons/pi";

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
    registration: UseFormRegisterReturn;
    placeholder?: string;
    iconName?: string;
    inputMode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
    addAsterisk?: boolean;
    initialValue?: string;
    inputType?: React.HTMLInputTypeAttribute;
};

export function TextFieldset({
    legendText,
    labelText,
    inputClassName,
    labelClassName,
    registration,
    placeholder,
    iconName,
    inputMode,
    addAsterisk,
    initialValue,
    inputType,
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
        case "year":
            iconComponent = <BiSolidCalendarAlt className="text-lg" />;
            break;
        case "paperwork":
            iconComponent = <HiMiniDocumentCheck className="text-lg" />;
            break;
        case "paint":
            iconComponent = <PiPaintBucketFill className="text-lg" />;
            break;
        case "order":
            iconComponent = <BiSolidReceipt className="text-lg" />;
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
                className={inputClassName}
                {...registration}
                placeholder={placeholder}
                inputMode={inputMode || "text"}
                value={initialValue || undefined}
                type={inputType || "text"}
            />
            <Label className={labelClassName} textContent={labelText} />
        </fieldset>
    );
}
