import { twMerge, type ClassNameValue } from "tailwind-merge";
import clsx from "clsx";

export function cn(...values: ClassNameValue[]) {
    return twMerge(clsx(values));
}
