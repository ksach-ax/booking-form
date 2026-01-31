import {
    useForm,
    type SubmitHandler,
    type SubmitErrorHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "./lib/cn";
import { TextFieldset } from "./form_components/text_fieldset";
import { PiHouseSimpleFill, PiMapPinFill } from "react-icons/pi";
import PlacesAutocomplete from "react-places-autocomplete";

const bookingDataSchema = z.object({
    dealershipName: z
        .string()
        .trim()
        .min(1, "Please enter the name of your dealership."),
    dealershipContactName: z
        .string()
        .trim()
        .min(1, "Please enter the contact name for the booking."),
    dealershipNumber: z
        .string()
        .trim()
        .regex(/^[0-9 ]*$/g, "Please enter only numbers and/or spaces.")
        .min(8, "Please enter a contact number for the booking."),
    dealershipType: z.literal(["showroom", "predelivery", "other"]),
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
            className="grid w-full p-16 gap-8"
        >
            <TextFieldset
                legendText="Dealership Name"
                labelText={
                    errors.dealershipName?.message
                        ? errors.dealershipName.message
                        : "Your dealership's name."
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
                iconName="dealership"
            />

            <TextFieldset
                legendText="Contact Name"
                labelText={
                    errors.dealershipContactName?.message
                        ? errors.dealershipContactName.message
                        : "Who should we call on the day?"
                }
                inputClassName={cn(
                    "input",
                    errors.dealershipContactName && "input-error",
                )}
                labelClassName={cn(
                    "label",
                    errors.dealershipContactName && "text-red-500",
                )}
                registrationReturn={register("dealershipContactName")}
                iconName="contact_name"
            />

            <TextFieldset
                legendText="Contact Number"
                labelText={
                    errors.dealershipNumber?.message
                        ? errors.dealershipNumber.message
                        : "Phone number of the booking contact."
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
                iconName="contact_phone"
            />

            <fieldset className="fieldset">
                <legend className="fieldset-legend">
                    <PiMapPinFill className="text-lg" />
                    Car location
                </legend>
                <select
                    className="select"
                    defaultValue="showroom"
                    {...register("dealershipType")}
                >
                    <option value="showroom">Showroom</option>
                    <option value="predelivery">Pre-delivery</option>
                    <option value="other">Other</option>
                </select>
                <label className="label">
                    Where will the car be located on the day?
                </label>
            </fieldset>

            <fieldset className="fieldset">
                <legend className="fieldset-legend">
                    <PiHouseSimpleFill className="text-lg" />
                    Booking address
                </legend>
                <input type="text" className="input" />
                <label className="label mb-2">Street Address</label>
                <div className="flex gap-8">
                    <div>
                        <select className="select">
                            <option>VIC</option>
                            <option>VIC</option>
                            <option>VIC</option>
                            <option>VIC</option>
                            <option>VIC</option>
                            <option>VIC</option>
                        </select>
                        <label className="label py-1">State</label>
                    </div>
                    <div className="grid">
                        <input type="text" className="input max-w-32" />
                        <label className="label">Post code</label>
                    </div>
                </div>
            </fieldset>
        </form>
    );
}
