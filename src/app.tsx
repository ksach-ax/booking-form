import "./app.css";
import { BookingForm } from "./booking_form";
import { useState } from "react";
import axLogo from "./assets/AutoXtreme_Navy.png";
import { cn } from "./lib/cn";
import { motion } from "motion/react";

function App() {
    const [step, setStep] = useState(0);
    const [started, setStarted] = useState(false);

    return (
        <>
            {started ? (
                <>
                    <motion.ul
                        className="steps steps-vertical min-h-150 left-4 md:hidden absolute"
                        initial={{ x: -100 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.8 }}
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
                    <motion.main
                        className="flex bg-base-200 font-main"
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <span
                            className="absolute right-8 top-4 font-black text-xl font-title"
                            onClick={() => setStarted(false)}
                        >
                            x
                        </span>
                        <BookingForm setStep={setStep} />
                    </motion.main>
                </>
            ) : (
                <motion.main className="grid h-screen place-content-center gap-8 bg-base-100 font-main">
                    <div className="card p-8">
                        <figure>
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
                                    onClick={() => setStarted(true)}
                                >
                                    Book at dealership/pre-delivery
                                </button>
                                <button
                                    className="btn-primary btn btn-block"
                                    onClick={() => setStarted(true)}
                                >
                                    Book with customer
                                </button>
                                <button
                                    className="btn-primary btn btn-block"
                                    onClick={() => setStarted(true)}
                                >
                                    Make a supply only order
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.main>
            )}
        </>
    );
}

export default App;
