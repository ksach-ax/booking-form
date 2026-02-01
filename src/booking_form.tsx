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
import type { Dispatch, SetStateAction } from "react";
import { useOverflowScrollPosition } from "@n8tb1t/use-scroll-position";
import { FaChevronUp } from "react-icons/fa";
import vehicleJSON from "./data/vehicles.json";

const vehicleJSONData = vehicleJSON as Record<string, string[]>;
const vehicleMakes: string[] = [];
for (const make of Object.keys(vehicleJSONData)) {
    vehicleMakes.push(make);
}

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
        .min(8, "Please enter a contact number for the booking.")
        .max(20, "Number too long."),
    dealershipType: z.literal(["showroom", "predelivery", "other"]),
    otherDealershipType: z.string().optional().or(z.string().min(3)),
    bookingStreetAddress: z
        .string()
        .trim()
        .min(3, "Please enter the street address for the booking."),
    bookingSuburb: z
        .string()
        .trim()
        .min(2, "Please enter the suburb for the booking."),
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
    bookingPostCode: z
        .string()
        .length(4, "4 digit post code")
        .regex(/^[0-9]{4}$/g, "4 digit post code"),
    vehicleMake: z.string().min(1, "Please enter the make of the vehicle."),
    vehicleModel: z.string().min(1, "Please enter the model of the vehicle."),
});

type BookingData = z.infer<typeof bookingDataSchema>;
type BookingFormProps = {
    setStep: Dispatch<SetStateAction<number>>;
};

export function BookingForm({ setStep }: BookingFormProps) {
    const [setRootRef] = useOverflowScrollPosition(({ currPos }) => {
        setStep(Math.round(currPos.y / window.innerHeight));
    });
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<BookingData>({ resolver: zodResolver(bookingDataSchema) });

    const onSubmit: SubmitHandler<BookingData> = (data) => {
        console.log(data);
    };

    const onError: SubmitErrorHandler<BookingData> = (data) =>
        console.log(data);

    const selectedMake = watch("vehicleMake");

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="text-xs md:grid md:grid-cols-3 md:max-w-7xl m-auto w-full pl-16 pr-12 snap-y scroll-smooth md:snap-none snap-mandatory max-h-screen overflow-auto"
            ref={setRootRef}
        >
            <section className="snap-start h-screen pt-8">
                <div>
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
                        inputMode="text"
                        addAsterisk
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
                        inputMode="text"
                        addAsterisk
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
                        inputMode="tel"
                        addAsterisk
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
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            <PiHouseSimpleFill className="text-lg" />
                            <span>Booking address</span>
                            <span className="text-red-500">*</span>
                        </legend>

                        <input
                            type="text"
                            className={cn(
                                "input",
                                errors.bookingStreetAddress && "input-error",
                            )}
                            {...register("bookingStreetAddress")}
                            placeholder="Street address"
                        />

                        <input
                            type="text"
                            className={cn(
                                "input",
                                errors.bookingSuburb && "input-error",
                            )}
                            {...register("bookingSuburb")}
                            placeholder="City/Suburb"
                        />

                        <div className="flex">
                            <div className="flex-1">
                                <select
                                    className="select"
                                    defaultValue="VIC"
                                    {...register("bookingState")}
                                >
                                    <option value="VIC">VIC</option>
                                    <option value="QLD">QLD</option>
                                    <option value="NSW">NSW</option>
                                    <option value="WA">WA</option>
                                    <option value="SA">SA</option>
                                    <option value="ACT">ACT</option>
                                    <option value="TAS">TAS</option>
                                    <option value="NT">NT</option>
                                </select>
                            </div>
                            <div className="grid flex-1">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className={cn(
                                        "input",
                                        errors.bookingPostCode && "input-error",
                                    )}
                                    {...register("bookingPostCode")}
                                    placeholder="Postcode"
                                />
                            </div>
                        </div>
                    </fieldset>
                    <div className="justify-center p-4 opacity-50 mx-auto md:hidden">
                        <span className="text-xs flex justify-center items-center gap-1 animate-pulse text-center pr-8 ">
                            <strong>Swipe</strong> to continue
                            <FaChevronUp className="text-xl pl-1" />
                        </span>
                    </div>
                </div>
            </section>

            <section className="h-screen snap-start pt-16 grid place-content-start">
                <h2 className="py-4 font-title text-3xl font-bold">
                    Vehicle information
                </h2>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Make
                        <span className="text-red-500">*</span>
                    </legend>
                    <input
                        type="text"
                        className={cn(
                            "input",
                            errors.vehicleMake && "input-error",
                        )}
                        list="makes"
                        {...register("vehicleMake")}
                    />
                    <datalist id="makes">
                        {vehicleMakes.map((make) => {
                            return <option value={make} key={make}></option>;
                        })}
                    </datalist>
                    <label
                        className={cn(
                            "label",
                            errors.vehicleMake && "text-red-500",
                        )}
                    >
                        {errors.vehicleMake
                            ? errors.vehicleMake?.message
                            : "The vehicle manufacturer"}
                    </label>
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Model
                        <span className="text-red-500">*</span>
                    </legend>
                    <input
                        type="text"
                        className={cn(
                            "input",
                            errors.vehicleModel && "input-error",
                        )}
                        list="models"
                        {...register("vehicleModel")}
                    />
                    <datalist id="models">
                        {selectedMake &&
                            Object.keys(vehicleJSONData).includes(
                                selectedMake,
                            ) &&
                            vehicleJSONData[selectedMake].map((model) => {
                                return (
                                    <option value={model} key={model}></option>
                                );
                            })}
                    </datalist>
                    <label
                        className={cn(
                            "label",
                            errors.vehicleModel && "text-red-500",
                        )}
                    >
                        {errors.vehicleModel
                            ? errors.vehicleModel?.message
                            : "The vehicle manufacturer"}
                    </label>
                </fieldset>
            </section>

            <section className="h-screen snap-start pt-16 grid">
                <h2 className="py-4 font-title text-3xl font-bold">
                    What would you like installed?
                </h2>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </section>
        </form>
    );
}
