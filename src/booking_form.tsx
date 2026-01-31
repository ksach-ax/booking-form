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
    otherDealershipType: z.string().optional().or(z.string().min(3)),
    bookingStreetAddress: z.string().trim().min(3, "Please enter the address for the booking."),
    bookingSuburb: z.string().trim().min(2, "Please enter the suburb for the booking."),
    bookingState: z.literal([
        "VIC",
        "QLD",
        "NSW",
        "ACT",
        "WA",
        "SA",
        "NT",
        "TAS",
    ]),
    bookingPostCode: z.string().length(4, "4 digits only").regex(/^[0-9 ]*$/g, "4 digits only"),
});

type BookingData = z.infer<typeof bookingDataSchema>;

export function BookingForm() {
    const {
        register,
        handleSubmit,
        setError,
        watch,
        formState: { errors },
    } = useForm<BookingData>({ resolver: zodResolver(bookingDataSchema) });

    const dealershipType = watch("dealershipType");
    const otherDealershipType = watch("otherDealershipType");

    const onSubmit: SubmitHandler<BookingData> = (data) => {
        console.log(data);
    }

    const onError: SubmitErrorHandler<BookingData> = (data) =>
        console.log(data);

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="w-full px-20 snap-y scroll-smooth snap-mandatory max-h-screen overflow-auto"
        >
            <section className="h-screen snap-start py-8">
                <TextFieldset
                    legendText="Dealership Name"
                    labelText={
                        errors.dealershipName?.message
                            ? errors.dealershipName.message
                            : "Your dealership name"
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
                    <input type="text" className="input" />
                    <label className="label mb-2">City/Suburb</label>
                    <div className="flex gap-8">
                        <div>
                            <select className="select" defaultValue="VIC">
                                <option value="VIC">VIC</option>
                                <option value="QLD">QLD</option>
                                <option value="NSW">NSW</option>
                                <option value="WA">WA</option>
                                <option value="SA">SA</option>
                                <option value="ACT">ACT</option>
                                <option value="TAS">TAS</option>
                                <option value="NT">NT</option>
                            </select>
                            <label className="label py-1">State</label>
                        </div>
                        <div className="grid">
                            <input type="text" className="input max-w-32" />
                            <label className="label">Post code</label>
                        </div>
                    </div>
                </fieldset>
            </section>
            <section className="h-screen snap-start py-8">
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
                            : "Phone number of the booking contact"
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
                    <input type="text" className="input" />
                    <label className="label mb-2">City/Suburb</label>
                    <div className="flex gap-8">
                        <div>
                            <select className="select" defaultValue="VIC">
                                <option value="VIC">VIC</option>
                                <option value="QLD">QLD</option>
                                <option value="NSW">NSW</option>
                                <option value="WA">WA</option>
                                <option value="SA">SA</option>
                                <option value="ACT">ACT</option>
                                <option value="TAS">TAS</option>
                                <option value="NT">NT</option>
                            </select>
                            <label className="label py-1">State</label>
                        </div>
                        <div className="grid">
                            <input type="text" className="input max-w-32" />
                            <label className="label">Post code</label>
                        </div>
                    </div>
                </fieldset>
            </section>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}
