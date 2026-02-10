import { useForm, useWatch, type SubmitHandler, type SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "./lib/cn";
import { TextFieldset } from "./form_components/text_fieldset";
import { PiHouseSimpleFill, PiMapPinFill, PiTrashFill } from "react-icons/pi";
import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useOverflowScrollPosition } from "@n8tb1t/use-scroll-position";
import { FaCarSide, FaChevronUp } from "react-icons/fa";
import vehicleJSON from "./data/vehicles.json";
import { RiAddCircleFill, RiSearchLine, RiShieldFill, RiStarFill } from "react-icons/ri";
import ProductList from "./data/products.json";
import { IoMdCheckmark, IoMdCloseCircle } from "react-icons/io";
import { IoListCircle } from "react-icons/io5";
import { AnimatePresence, motion } from "motion/react";

const bookingDataSchema = z.object({
    dealershipName: z.string().trim().min(1, "Please enter the name of your dealership."),
    dealershipContactName: z.string().trim().min(1, "Please enter the contact name."),
    dealershipContactNumber: z
        .string()
        .trim()
        .regex(/^[0-9 ]*$/g, "Please enter only numbers and/or spaces.")
        .min(8, "Please enter a contact number.")
        .max(20, "Number too long."),
    dealershipType: z.literal(["showroom", "predelivery", "other"]),
    otherDealershipType: z.string().optional().or(z.string().min(3)),
    bookingStreetAddress: z.string().trim().min(3, "Please enter the street address."),
    bookingSuburb: z.string().trim().min(2, "Please enter the suburb."),
    bookingState: z.literal(["VIC", "QLD", "NSW", "ACT", "WA", "SA", "NT", "TAS"]),
    bookingPostCode: z
        .string()
        .length(4, "4 digit post code")
        .regex(/^[0-9]{4}$/g, "4 digit post code"),
    vehicleMake: z.string().min(1, "Please enter the make of the vehicle."),
    vehicleModel: z.string().min(1, "Please enter the model of the vehicle."),
    vehicleYear: z.string().length(4, "Please enter the year of the vehicle."),
    vehicleStockOrRego: z.string().min(2, "Please enter the stock/rego of the vehicle."),
    vehicleColor: z.optional(z.string()),
    productSearchInput: z.optional(z.string()),
    purchaseOrder: z.string().min(2, "Please enter the purchase order number."),
    bookingDate: z.optional(z.string()),
    preferredTime: z.literal(["preferred_none", "preferred_am", "preferred_pm"]),
    wantsASAP: z.boolean(),
    vehicleHasCanopy: z.boolean(),
    vehicleIsHybridEv: z.boolean(),
    additionalNotes: z.optional(z.string()),
});

const PRODUCT_CATEGORIES = {
    dash_cams: "Dash Cameras",
    dash_cam_accessories: "Dash Cam Batteries & Accessories",
    security_gps: "Vehicle Security & GPS Tracking",
    reversing_safety_systems: "Reversing & Safety Systems",
    multimedia: "Multimedia",
    "4wd_towing": "4WD & Towing",
} as const;
const vehicleJSONData = vehicleJSON as Record<string, string[]>;
const vehicleMakes: string[] = Object.keys(vehicleJSONData);

type BookingData = z.infer<typeof bookingDataSchema>;
type BookingFormProps = {
    setStep: Dispatch<SetStateAction<number>>;
};
type Product = (typeof ProductList)[number];
type BrowsingCategory = keyof typeof PRODUCT_CATEGORIES;

function getProductImageUrl(code: string) {
    return new URL(`./assets/product_icons/${code}.webp`, import.meta.url).href;
}

function getLocalStorageValue(key: string) {
    return localStorage.getItem(key);
}

function setLocalStorageValue(key: string, value: string) {
    return localStorage.setItem(key, value);
}

function prettyDealerType(str: string) {
    switch (str) {
        case "dealership":
            return "Dealership";
        case "predelivery":
            return "Pre-delivery";
        default:
            return "Other";
    }
}

export function BookingForm({ setStep }: BookingFormProps) {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [browsingCategory, setBrowsingCategory] = useState<BrowsingCategory | null>(null);

    const [setRootRef] = useOverflowScrollPosition(({ currPos }) => {
        setStep(Math.round(currPos.y / window.innerHeight));
    });

    const {
        register,
        handleSubmit,
        watch,
        control,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<BookingData>({ resolver: zodResolver(bookingDataSchema) });

    const selectedMake = watch("vehicleMake");
    const productSearchInput = useWatch({ control, name: "productSearchInput" }) ?? "";
    const wantsASAP = watch("wantsASAP");

    const getFilteredProducts: undefined | Product[] = useMemo(() => {
        const query = productSearchInput.trim().toLowerCase();
        if (!query) return;

        return ProductList.filter((product) => {
            const haystack = `${product.productName} ${product.productCode}`.toLowerCase();
            if (
                !haystack.includes(query) ||
                selectedProducts.some(
                    (selectedProduct) => selectedProduct.productCode === product.productCode,
                )
            )
                return false;
            return true;
        });
    }, [productSearchInput, selectedProducts]);

    useEffect(() => {
        window.addEventListener("click", (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains("dd_item") || target.tagName === "INPUT") return;
            setValue("productSearchInput", "");
        });

        const rememberedValues = {
            dealershipName: getLocalStorageValue("dealershipName"),
            dealershipContactName: getLocalStorageValue("dealershipContactName"),
            dealershipContactNumber: getLocalStorageValue("dealershipContactNumber"),
            dealershipType: getLocalStorageValue("dealershipType"),
            bookingStreetAddress: getLocalStorageValue("bookingStreetAddress"),
            bookingSuburb: getLocalStorageValue("bookingSuburb"),
            bookingState: getLocalStorageValue("bookingState"),
            bookingPostCode: getLocalStorageValue("bookingPostCode"),
        };

        for (const [key, val] of Object.entries(rememberedValues)) {
            const k = key as keyof BookingData;
            if (val !== null) setValue(k, val);
        }
    }, []);

    const activeTabRef = useRef<HTMLAnchorElement | null>(null);
    const productModalToggle = useRef<HTMLInputElement | null>(null);
    const confirmModalToggle = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (activeTabRef.current) {
            activeTabRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        }
    }, [browsingCategory]);

    const onSubmit: SubmitHandler<BookingData> = (data) => {
        const final = { data, products: selectedProducts.map((product) => product.productCode) };
        const {
            dealershipName,
            dealershipContactName,
            dealershipContactNumber,
            dealershipType,
            bookingStreetAddress,
            bookingSuburb,
            bookingState,
            bookingPostCode,
        } = final.data;

        setLocalStorageValue("dealershipName", dealershipName);
        setLocalStorageValue("dealershipContactName", dealershipContactName);
        setLocalStorageValue("dealershipContactNumber", dealershipContactNumber);
        setLocalStorageValue("dealershipType", dealershipType);
        setLocalStorageValue("bookingStreetAddress", bookingStreetAddress);
        setLocalStorageValue("bookingSuburb", bookingSuburb);
        setLocalStorageValue("bookingState", bookingState);
        setLocalStorageValue("bookingPostCode", bookingPostCode);
        console.log(final);
    };
    const onError: SubmitErrorHandler<BookingData> = (data) => console.log(data);

    function addProduct(productCode: string) {
        const product = ProductList.find((product) => product.productCode === productCode);
        const alreadySelected = selectedProducts.some((product) => {
            return product.productCode === productCode;
        });

        if (!product || alreadySelected) return;

        setSelectedProducts((prevSelectedProducts) => [...prevSelectedProducts, product]);
        setValue("productSearchInput", "");
        (document.getElementById("product-modal")! as HTMLInputElement).checked = false;

        new Promise(() =>
            setTimeout(() => {
                setBrowsingCategory(null);
            }, 300),
        );
    }

    function removeProduct(productCode: string) {
        setSelectedProducts((prevState) => {
            const newProductList = prevState.filter((product) => {
                return productCode !== product.productCode;
            });

            return [...newProductList];
        });
    }

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit, onError)}
                className="md:snap-none snap-y snap-mandatory overflow-auto max-h-[calc(100dvh-48px)] top-12 fixed w-full md:p-4 md:grid md:grid-cols-2 lg:grid-cols-4 "
                ref={setRootRef}
            >
                <section className="snap-start h-[calc(100dvh-48px)] pt-2 pl-24 pr-12 md:p-4 justify-stretch ">
                    <div className="w-full">
                        <h2 className="hidden md:block font-bold font-title text-lg">
                            Contact details
                        </h2>
                        <TextFieldset
                            legendText="Dealership Name"
                            labelText={errors.dealershipName?.message || "Your dealership name"}
                            inputClassName={cn("input", errors.dealershipName && "input-error")}
                            labelClassName={cn("label", errors.dealershipName && "text-red-500")}
                            registration={register("dealershipName")}
                            iconName="dealership"
                            inputMode="text"
                            addAsterisk
                        />
                        <TextFieldset
                            legendText="Contact Name"
                            labelText={
                                errors.dealershipContactName?.message ||
                                "Who should we call on the day?"
                            }
                            inputClassName={cn(
                                "input",
                                errors.dealershipContactName && "input-error",
                            )}
                            labelClassName={cn(
                                "label",
                                errors.dealershipContactName && "text-red-500",
                            )}
                            registration={register("dealershipContactName")}
                            iconName="contact_name"
                            inputMode="text"
                            addAsterisk
                        />
                        <TextFieldset
                            legendText="Contact Number"
                            labelText={
                                errors.dealershipContactNumber?.message ||
                                "Phone number of the booking contact"
                            }
                            inputClassName={cn(
                                "input",
                                errors.dealershipContactNumber && "input-error",
                            )}
                            labelClassName={cn(
                                "label",
                                errors.dealershipContactNumber && "text-red-500",
                            )}
                            registration={register("dealershipContactNumber")}
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
                                className={cn("input", errors.bookingSuburb && "input-error")}
                                {...register("bookingSuburb")}
                                placeholder="City/Suburb"
                            />

                            <div className="max-w-xs">
                                <div className="gap-5 flex">
                                    <select
                                        className="select inline"
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
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        className={cn(
                                            "input max-w-48",
                                            errors.bookingPostCode && "input-error",
                                        )}
                                        {...register("bookingPostCode")}
                                        placeholder="Postcode"
                                    />
                                </div>
                            </div>
                        </fieldset>
                        <div className="justify-center pt-2 opacity-50 mx-auto md:hidden">
                            <span className="text-xs flex justify-center items-center gap-1 animate-pulse text-center pr-8 pointer-events-none select-none">
                                <strong>Swipe</strong> to continue
                                <FaChevronUp className="text-xl pl-1" />
                            </span>
                        </div>
                    </div>
                </section>

                <section className="snap-start h-[calc(100dvh-48px)] pt-2 pl-24 pr-12 md:p-4 justify-stretch">
                    <div>
                        <h2 className="hidden md:block font-bold font-title text-lg">
                            Vehicle Details
                        </h2>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                <RiShieldFill className="text-lg" />
                                Make
                                <span className="text-red-500">*</span>
                            </legend>
                            <input
                                type="text"
                                className={cn("input", errors.vehicleMake && "input-error")}
                                list="makes"
                                {...register("vehicleMake")}
                            />
                            <datalist id="makes">
                                {vehicleMakes.map((make) => {
                                    return <option value={make} key={make}></option>;
                                })}
                            </datalist>
                            <label className={cn("label", errors.vehicleMake && "text-red-500")}>
                                {errors.vehicleMake?.message || "The vehicle manufacturer"}
                            </label>
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                <FaCarSide className="text-lg" />
                                Model
                                <span className="text-red-500">*</span>
                            </legend>
                            <input
                                type="text"
                                className={cn("input", errors.vehicleModel && "input-error")}
                                list="models"
                                {...register("vehicleModel")}
                            />
                            <datalist id="models">
                                {selectedMake &&
                                    Object.keys(vehicleJSONData).includes(selectedMake) &&
                                    vehicleJSONData[selectedMake].map((model) => {
                                        return <option value={model} key={model}></option>;
                                    })}
                            </datalist>
                            <label className={cn("label", errors.vehicleModel && "text-red-500")}>
                                {errors.vehicleModel?.message || "The vehicle model"}
                            </label>
                        </fieldset>
                        <TextFieldset
                            legendText="Year"
                            labelText={errors.vehicleYear?.message || "The vehicle's build year"}
                            registration={register("vehicleYear")}
                            labelClassName={cn("label", errors.vehicleYear && "text-red-500")}
                            inputClassName={cn("input", errors.vehicleYear && "input-error")}
                            iconName="year"
                            initialValue={String(new Date().getFullYear())}
                            addAsterisk
                        />

                        <TextFieldset
                            legendText="Stock#"
                            labelText={
                                errors.vehicleStockOrRego?.message ||
                                "What should we use to identify the vehicle?"
                            }
                            registration={register("vehicleStockOrRego")}
                            labelClassName={cn(
                                "label",
                                errors.vehicleStockOrRego && "text-red-500",
                            )}
                            inputClassName={cn("input", errors.vehicleStockOrRego && "input-error")}
                            iconName="paperwork"
                            placeholder="or Registration/VIN"
                            addAsterisk
                        />

                        <TextFieldset
                            legendText="Body colour"
                            labelText={
                                errors.vehicleColor?.message ||
                                "Paint code if having parking sensors installed"
                            }
                            registration={register("vehicleColor")}
                            labelClassName={cn("label", errors.vehicleColor && "text-red-500")}
                            inputClassName={cn("input", errors.vehicleColor && "input-error")}
                            iconName="paint"
                        />
                    </div>

                    <div className="justify-center pt-2 opacity-50 mx-auto md:hidden">
                        <span className="text-xs flex justify-center items-center gap-1 animate-pulse text-center pr-8 pointer-events-none select-none">
                            <strong>Swipe</strong> to continue
                            <FaChevronUp className="text-xl pl-1" />
                        </span>
                    </div>
                </section>

                <section className="h-[calc(100dvh-48px)] snap-start pt-3 pl-20 pr-8 flex flex-col md:w-full md:p-4">
                    <div className="w-full">
                        <h2 className="hidden md:block font-bold font-title text-lg">
                            Choose your products
                        </h2>
                        <div className="join join-vertical w-full flex md:pt-4">
                            <p className="p-2 pl-4 bg-primary text-primary-content join-item text-xs leading-none">
                                Quick search all products
                            </p>
                            <div>
                                <label className="input w-full focus-within:outline-none! shadow-sm z-10">
                                    <RiSearchLine className="opacity-60" />
                                    <input
                                        type="text"
                                        placeholder="Start typing..."
                                        {...register("productSearchInput")}
                                        autoComplete="off"
                                    />
                                    {productSearchInput && (
                                        <IoMdCloseCircle className="opacity-60 text-lg" />
                                    )}
                                    {productSearchInput && getFilteredProducts && (
                                        <div className="list join-item shadow-md bg-base-100 border-secondary border text-xs absolute w-full left-0 top-10 z-20">
                                            {getFilteredProducts.map((product, index) => {
                                                if (index >= 8) return;
                                                return (
                                                    <div
                                                        className="list-row hover:cursor-pointer hover:bg-secondary touch-pan-x dd_item items-center "
                                                        key={`dd - ${product.productCode}`}
                                                        onClick={() =>
                                                            addProduct(product.productCode)
                                                        }
                                                        id={`${product.productCode}`}
                                                    >
                                                        <img
                                                            src={getProductImageUrl(
                                                                product.iconName,
                                                            )}
                                                            alt={product.productCode}
                                                            className="w-8 aspect-square object-contain rounded-full bg-white p-1"
                                                        />
                                                        <div className="flex flex-col truncate">
                                                            <span className="truncate text-[8pt] font-main font-medium">
                                                                {product.productName}
                                                            </span>
                                                            <span className="text-[7pt] font-sans opacity-60 font-bold">
                                                                {product.productDesc}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            {product.featured && (
                                                                <RiStarFill className="text-yellow-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="card flex-1 shadow-sm max-h-128 ">
                        <div className="card-body p-0 overflow-y-auto bg-linear-to-b from-base-300 bg-base-200 from-5%">
                            <div className="rounded-box">
                                <AnimatePresence>
                                    {selectedProducts &&
                                        selectedProducts.map((product) => {
                                            return (
                                                <motion.div
                                                    className="card border border-base-300 bg-base-100 list-row shadow-md card-side font-main"
                                                    key={`cart - ${product.productCode}`}
                                                    layout
                                                    transition={{ duration: 0.2 }}
                                                    initial={{ y: -150 }}
                                                    animate={{ y: 0 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <figure className="max-w-24 flex-none">
                                                        <img
                                                            src={getProductImageUrl(
                                                                product.iconName,
                                                            )}
                                                            alt=""
                                                            className="object-contain bg-white p-2"
                                                        />
                                                    </figure>
                                                    <div className="card-body border-l-base-300 border-l p-0">
                                                        <p className="card-title text-xs px-4 py-2">
                                                            <span className="max-w-48">
                                                                {product.productName}
                                                                {product.featured && (
                                                                    <RiStarFill className="text-yellow-500 inline mb-0.5 ml-1" />
                                                                )}
                                                            </span>
                                                        </p>
                                                        <p className="text-xs opacity-80 pl-4">
                                                            {product.productDesc}
                                                        </p>
                                                        {!product.isSupplyOnlyItem && (
                                                            <p className="text-[7pt] opacity-60 flex gap-1 pl-4">
                                                                Supplied & fitted
                                                                <IoMdCheckmark />
                                                            </p>
                                                        )}
                                                        <p className="text-[7pt] opacity-60 pl-4">
                                                            Product#:{" "}
                                                            <strong className="font-mono tracking-normal leading-none font-black">
                                                                {product.productCode}
                                                            </strong>
                                                        </p>
                                                        <div className="card-actions justify-end">
                                                            <a
                                                                className="btn btn-ghost btn-error btn-circle btn-xs text-[7pt] mr-1 mb-1"
                                                                onClick={() =>
                                                                    removeProduct(
                                                                        product.productCode,
                                                                    )
                                                                }
                                                            >
                                                                <PiTrashFill className="text-[10pt]" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                </AnimatePresence>
                            </div>
                            <label
                                className="grid place-content-center place-items-center gap-2 font-display max-h-128 flex-1 pt-4"
                                htmlFor="product-modal"
                            >
                                <div>
                                    <span className="text-neutral-400 select-none leading-none">
                                        Tap inside to add an item
                                    </span>
                                    <RiAddCircleFill className="text-6xl mb-8 mx-auto text-neutral-300 pt-2" />
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="opacity-50 mx-auto md:hidden">
                        <span className="text-xs flex justify-center items-center gap-1 animate-pulse text-center pointer-events-none select-none mt-4 mb-2">
                            <strong>Swipe</strong> to continue
                            <FaChevronUp className="text-xl pl-1" />
                        </span>
                    </div>
                </section>

                <section className="h-[calc(100dvh-48px)] snap-start pt-3 pl-20 pr-8 flex flex-col ">
                    <h2 className="hidden md:block font-bold font-title text-lg">Finishing up</h2>
                    <TextFieldset
                        legendText="Purchase Order#"
                        labelText={
                            errors.purchaseOrder?.message || "The order number for invoicing"
                        }
                        inputClassName={cn("input", errors.purchaseOrder && "input-error")}
                        labelClassName={cn("label", errors.purchaseOrder && "text-red-500")}
                        registration={register("purchaseOrder")}
                        iconName="order"
                        inputMode="text"
                        addAsterisk
                    />
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Date & time</legend>

                        <p className="w-full flex justify-between">
                            Next available booking date
                            <input
                                type="checkbox"
                                defaultChecked
                                {...register("wantsASAP")}
                                className="toggle ml-2 "
                            />
                        </p>
                        <AnimatePresence>
                            {!wantsASAP && (
                                <motion.div
                                    layout
                                    className="flex items-center"
                                    initial={{ y: -15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    key={"date-picker"}
                                >
                                    <input
                                        type="date"
                                        className={cn(
                                            "input flex-2",
                                            errors.bookingDate && "input-error",
                                        )}
                                        {...register("bookingDate")}
                                        required
                                        min={new Date().toISOString().slice(0, 10)}
                                    />
                                    <select
                                        className="select flex-1"
                                        {...register("preferredTime")}
                                        defaultValue="preferred_none"
                                    >
                                        <option value="preferred_none">All day</option>
                                        <option value="preferred_am">AM</option>
                                        <option value="preferred_pm">PM</option>
                                    </select>
                                </motion.div>
                            )}
                            <label className={cn("label", wantsASAP && "hidden")} key="date-label">
                                Your preferred date/time for fitment
                            </label>
                        </AnimatePresence>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Extra details</legend>
                        <p className="w-full flex justify-between">
                            Does this vehicle have a canopy?
                            <input
                                type="checkbox"
                                {...register("vehicleHasCanopy")}
                                className="toggle toggle-accent ml-2 "
                            />
                        </p>
                        <p className="w-full flex justify-between">
                            Is this vehicle a Hybrid/EV?
                            <input
                                type="checkbox"
                                {...register("vehicleIsHybridEv")}
                                className="toggle toggle-warning ml-2 "
                            />
                        </p>
                        <textarea
                            className="textarea min-h-32 mt-4"
                            placeholder="Additional notes (e.g. VIN#/Rego#)"
                            {...register("additionalNotes")}
                        ></textarea>
                        <label className="label"></label>
                    </fieldset>
                    <label
                        className="btn btn-block btn-primary"
                        htmlFor="confirm-modal"
                        {
                            /** onClick={(ev) => {
                            if (!isValid) {
                                ev.preventDefault();
                                handleSubmit(onSubmit)();
                            }
                        }}
                        */ ...{}
                        }
                    >
                        Confirm & send booking
                    </label>
                </section>
            </form>

            <input
                type="checkbox"
                id="product-modal"
                ref={productModalToggle}
                className="modal-toggle"
            />
            <div className="modal z-30" role="dialog">
                <div className="modal-box h-[calc(100dvh-120px)] p-0 rounded-md dark:border dark:border-base-200 max-w-dvw overflow-visible">
                    <button
                        onClick={() => {
                            if (productModalToggle.current) {
                                productModalToggle.current.checked = false;
                            }
                        }}
                        className="absolute shadow-md btn btn-circle -right-1 -top-1 z-30 text-3xl"
                    >
                        <IoMdCloseCircle />
                    </button>
                    {browsingCategory && (
                        <button
                            onClick={() => setBrowsingCategory(null)}
                            className="absolute shadow-md btn btn-circle -left-1 -top-1 z-30 text-3xl"
                        >
                            <IoListCircle />
                        </button>
                    )}
                    {browsingCategory ? (
                        <div className="flex flex-col h-full">
                            <div className="grid grid-cols-2 flex-1 overflow-y-auto gap-2 p-2 grid-rows-[repeat(auto-fill,200px)] [scrollbar-width:none]">
                                {ProductList.filter((product) => {
                                    if (product.category !== browsingCategory) return false;
                                    if (
                                        selectedProducts.some(
                                            (selectedProduct) =>
                                                selectedProduct.productCode === product.productCode,
                                        )
                                    ) {
                                        return false;
                                    }

                                    return true;
                                })
                                    .sort((a) => (a.featured ? -1 : 1))
                                    .map((product) => {
                                        return (
                                            <div
                                                className="card shadow-sm card-border bg-base-300 rounded-md h-50 select-none hover:border-primary hover:cursor-pointer active:scale-95"
                                                onClick={() => addProduct(product.productCode)}
                                                key={`product - ${product.productCode}`}
                                            >
                                                <figure className="w-full h-16 flex justify-start pl-4 join-item bg-white rounded">
                                                    <img
                                                        src={getProductImageUrl(product.iconName)}
                                                        alt=""
                                                        className="object-contain h-3/4 max-w-16"
                                                    />
                                                </figure>
                                                <div className="card-body join-item">
                                                    {product.featured && (
                                                        <RiStarFill className="text-yellow-500 absolute right-2 bottom-24" />
                                                    )}
                                                    <div className="card-title text-xs font-main">
                                                        {product.productName}
                                                    </div>
                                                    <p className="font-main text-[7pt] opacity-60 font-bold">
                                                        {product.productDesc}
                                                    </p>
                                                    <span className="text-[6pt] font-sans font-bold opacity-40">
                                                        Product#: {product.productCode}
                                                    </span>
                                                    <RiAddCircleFill className="text-xl absolute right-2 bottom-2" />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            <div
                                role="tablist"
                                className="tabs snap-mandatory snap-x overflow-x-auto max-w-full font-title shadow-[0_-5px_15px_rgba(100,100,100,0.4)] z-30 flex-nowrap tabs-lift [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            >
                                {Object.keys(PRODUCT_CATEGORIES).map((categoryId) => {
                                    return (
                                        <a
                                            role="tab"
                                            key={`tab - ${categoryId}`}
                                            className={cn(
                                                "tab snap-center text-nowrap text-xs font-bold",
                                                browsingCategory === categoryId && "tab-active",
                                            )}
                                            ref={
                                                browsingCategory === categoryId
                                                    ? activeTabRef
                                                    : null
                                            }
                                            onClick={() => {
                                                setBrowsingCategory(categoryId as BrowsingCategory);
                                            }}
                                        >
                                            {PRODUCT_CATEGORIES[categoryId as BrowsingCategory]}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="grid h-full p-4 gap-2">
                            {Object.entries(PRODUCT_CATEGORIES).map(([key, val]) => {
                                return (
                                    <button
                                        className="btn h-full btn-primary flex"
                                        key={key}
                                        onClick={() => setBrowsingCategory(key as BrowsingCategory)}
                                    >
                                        {val}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
                <label className="modal-backdrop" htmlFor="product-modal">
                    Close
                </label>
            </div>

            <input
                type="checkbox"
                id="confirm-modal"
                className="modal-toggle"
                ref={confirmModalToggle}
            />
            <div className="modal" role="dialog">
                <div className="modal-box overflow-visible">
                    <button
                        onClick={() => {
                            if (confirmModalToggle.current) {
                                confirmModalToggle.current.checked = false;
                            }
                        }}
                        className="absolute shadow-md btn btn-circle -right-1 -top-1 z-30 text-3xl"
                    >
                        <IoMdCloseCircle />
                    </button>
                    <div className="font-main overflow-y-auto">
                        <h3 className="text-lg font-bold">Booking details</h3>
                        <div className="divider m-0"></div>
                        <div className="grid grid-cols-2 gap-3 py-4">
                            <div className="text-xs">
                                <div className="grid gap-3">
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">
                                            Dealership name{" "}
                                        </p>
                                        <p className="leading-none h-full m-0 font-medium ">
                                            {getValues().dealershipName}
                                        </p>
                                    </div>
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">
                                            Dealership contact name{" "}
                                        </p>
                                        <p className="leading-none h-full font-medium m-0">
                                            {getValues().dealershipContactName}
                                        </p>
                                    </div>
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">
                                            Contact number{" "}
                                        </p>
                                        <p className="leading-none h-full font-medium m-0">
                                            {getValues().dealershipContactNumber}
                                        </p>
                                    </div>
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">
                                            Dealership location{" "}
                                        </p>
                                        <p className="leading-none h-full font-medium m-0">
                                            {prettyDealerType(getValues().dealershipType)}
                                        </p>
                                    </div>
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">
                                            Booking address{" "}
                                        </p>
                                        <p className="leading-none h-full font-medium m-0">
                                            {`${getValues().bookingStreetAddress} `}
                                        </p>
                                        <p className="leading-none font-medium">
                                            {`${getValues().bookingSuburb} ${getValues().bookingState} ${getValues().bookingPostCode}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs">
                                <div className="grid gap-3">
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">Make</p>
                                        <p className="leading-none h-full font-medium m-0">
                                            {getValues().vehicleMake}
                                        </p>
                                    </div>
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">Model</p>
                                        <p className="leading-none h-full font-medium m-0">
                                            {getValues().vehicleModel}
                                        </p>
                                    </div>
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">Year</p>
                                        <p className="leading-none h-full font-medium m-0">
                                            {getValues().vehicleYear}
                                        </p>
                                    </div>
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">
                                            Stock# / Rego# / Vin#
                                        </p>
                                        <p className="leading-none h-full font-medium m-0">
                                            {getValues().vehicleStockOrRego}
                                        </p>
                                    </div>
                                    <div className="grid gap-1">
                                        <p className="leading-none m-0 opacity-60">Body color</p>
                                        <p className="leading-none h-full font-medium m-0">
                                            {getValues().vehicleColor || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg">Products</h3>
                        <div className="divider m-0"></div>
                        <ul className="list pt-4">
                            {selectedProducts.map((product) => {
                                return (
                                    <li className="list-row text-xs font-main border-x first-of-type:border-t last-of-type:border-b border-base-300 items-center min-h-10">
                                        <img
                                            src={getProductImageUrl(product.iconName)}
                                            width="32"
                                        />
                                        <p className="list-col-grow text-[8pt] font-medium">
                                            {product.productName}
                                        </p>
                                        <p className="opacity-60 font-sans font-bold text-[7pt]">
                                            {product.productCode}
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                        <button
                            className="btn btn-primary btn-block"
                            onClick={handleSubmit(onSubmit)}
                        >
                            Send booking
                        </button>
                    </div>
                </div>
                <label className="modal-backdrop" htmlFor="confirm-modal"></label>
            </div>
        </>
    );
}
