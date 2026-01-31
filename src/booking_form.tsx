import {
    useForm,
    type SubmitHandler,
    type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "./lib/cn";
import { TextFieldset } from "./form_components/text_fieldset";

const bookingDataSchema = z.object({
    dealershipName: z
        .string()
        .trim()
        .min(1, "Please enter the name of your dealership."),
    dealershipNumber: z
        .string()
        .trim()
        .regex(/^[0-9 ]*$/g, "Please enter only numbers and/or spaces.")
        .min(8, "Please enter a contact number for the booking."),
});

type BookingData = z.infer<typeof bookingDataSchema>;

export function BookingForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BookingData>({ resolver: zodResolver(bookingDataSchema) });

    const onSubmit: SubmitHandler<BookingData> = (data) => console.log(data);
    const onError: SubmitErrorHandler<BookingData> = (data) =>
        console.log(data);

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="grid w-full p-8 gap-4"
        >
            <TextFieldset
                legendText="Dealership Name"
                labelText={
                    errors.dealershipName?.message
                        ? errors.dealershipName.message
                        : "Enter your dealership name"
                }
                inputClassName={cn(
                    "input",
                    errors.dealershipName && "input-error",
                )}
                labelClassName={cn(
                    "label",
                    errors.dealershipName && "text-red-500",
                )}
                registrationReturn={register("dealershipName")}
            />
            <TextFieldset
                legendText="Contact Number"
                labelText={
                    errors.dealershipNumber?.message
                        ? errors.dealershipNumber.message
                        : "Enter the contact number"
                }
                inputClassName={cn(
                    "input",
                    errors.dealershipNumber && "input-error",
                )}
                labelClassName={cn(
                    "label",
                    errors.dealershipNumber && "text-red-500",
                )}
                registrationReturn={register("dealershipNumber")}
            />
            <button
                type="submit"
                className="btn btn-primary place-self-center px-8"
            >
                Submit
            </button>
        </form>
    );
}
