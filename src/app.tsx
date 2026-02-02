import "./app.css";
import { BookingForm } from "./booking_form";
import { useState } from "react";
import axLogo from "./assets/AutoXtreme_Navy.png";
import { cn } from "./lib/cn";
import { AnimatePresence, motion } from "motion/react";
import { PiArrowLeft } from "react-icons/pi";
const ORDER_TYPE_DESCRIPTIONS = {
    dealer: "Dealership/PD booking",
    customer: "Customer direct booking",
    supply: "Supply only order",
} as const;

const orderSteps = {
    dealer: [
        "1. Location & contact",
        "2. Vehicle details",
        "3. Choose your products",
        "4. Finishing up",
    ],
    customer: [],
    supply: [],
};

type OrderType = keyof typeof ORDER_TYPE_DESCRIPTIONS;

function App() {
    const [step, setStep] = useState(0);
    const [started, setStarted] = useState(false);
    const [orderType, setOrderType] = useState<OrderType>("dealer");

    const handleStart = (ev: React.MouseEvent<HTMLButtonElement>) => {
        const target = ev.target as HTMLButtonElement;
        const buttonValue = target.value;

        if (!Object.keys(ORDER_TYPE_DESCRIPTIONS).includes(buttonValue)) return;
        setOrderType(buttonValue as OrderType);
        setStarted(true);
    };

    return (
        <AnimatePresence>
            {started ? (
                <motion.div
                    initial={{ x: 500, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{
                        x: 0,
                        opacity: 1,
                        transition: { delay: 0.5, bounce: 0 },
                    }}
                    key="main-page-wrapper"
                >
                    <motion.nav
                        className="fixed font-display w-full bg-primary text-primary-content shadow-xs p-2 px-4 flex items-center z-10 justify-between"
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        transition={{ bounce: 0, delay: 1 }}
                    >
                        <div className="breadcrumbs text-xs">
                            <ul>
                                <li className="font-bold">
                                    {ORDER_TYPE_DESCRIPTIONS[orderType]}
                                </li>
                                <li className="font-medium">
                                    {orderSteps[orderType][step]}
                                </li>
                            </ul>
                        </div>
                        <span
                            className="right-8 top-4 text-xs opacity-60 gap-1 flex items-center"
                            onClick={() => {
                                setStarted(false);
                                setStep(0);
                            }}
                        >
                            <PiArrowLeft />
                            Go back
                        </span>
                    </motion.nav>
                    <motion.ul
                        className="steps steps-vertical min-h-150 left-4 md:hidden absolute pointer-events-none"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                    >
                        {[...Array(4)].map((_, index) => {
                            return (
                                <li
                                    className={cn(
                                        "step",
                                        index <= step && "step-primary",
                                    )}
                                    key={index}
                                ></li>
                            );
                        })}
                    </motion.ul>
                    <main
                        key="main-form"
                        className="flex bg-base-200 font-display"
                    >
                        <BookingForm setStep={setStep} />
                    </main>
                </motion.div>
            ) : (
                <main
                    key="splash-screen"
                    className="grid h-screen place-content-center gap-8 bg-base-100 font-display"
                >
                    <motion.div
                        key="splash-card"
                        className="card p-8"
                        animate={{
                            x: 0,
                            opacity: 1,
                            transition: { duration: 1, delay: 0.3 },
                        }}
                        initial={{
                            x: -300,
                            opacity: 0,
                        }}
                        exit={{
                            x: -300,
                            opacity: 0,
                            transition: { duration: 0.5 },
                        }}
                    >
                        <figure className="pb-4">
                            <img
                                src={axLogo}
                                className="dark:invert-100 dark:saturate-0"
                                alt="AutoXtreme Logo"
                                width="172px"
                            />
                        </figure>
                        <div className="card-body gap-4">
                            <h2 className="card-title font-display text-xl">
                                Order with us
                            </h2>
                            <p className="pb-2 opacity-60">
                                Select from the below options to get started
                            </p>
                            <div className="card-actions gap-8">
                                <button
                                    className="btn-primary btn btn-block"
                                    onClick={handleStart}
                                    value="dealer"
                                >
                                    Book at dealership/pre-delivery
                                </button>
                                <button
                                    className="btn-primary btn btn-block"
                                    onClick={handleStart}
                                    value="customer"
                                >
                                    Book with customer
                                </button>
                                <button
                                    className="btn-primary btn btn-block"
                                    onClick={handleStart}
                                    value="supply"
                                >
                                    Create a supply only order
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </main>
            )}
        </AnimatePresence>
    );
}

export default App;
