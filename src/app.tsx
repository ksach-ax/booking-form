import "./app.css";
import { BookingForm } from "./booking_form";
import { useState } from "react";
import axLogo from "./assets/AutoXtreme_Navy.png";
import { cn } from "./lib/cn";

function App() {
    const [step, setStep] = useState(0);
    const [started, setStarted] = useState(false);

    return (
        <>
            {started ? (
                <>
                    <ul className="steps steps-vertical min-h-150 left-4 md:hidden absolute">
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
                    </ul>
                    <main className="flex bg-base-200">
                        <span
                            className="absolute right-8 top-4 font-black text-xl font-title"
                            onClick={() => setStarted(false)}
                        >
                            x
                        </span>
                        <BookingForm setStep={setStep} />
                    </main>
                </>
            ) : (
                <main className="grid h-screen place-content-center gap-8">
                    <img src={axLogo} className="w-72" alt="AutoXtreme Logo" />
                    <h1 className="text-center text-2xl font-display">
                        Book with us
                    </h1>
                    <button
                        className="btn-accent btn"
                        onClick={() => setStarted(true)}
                    >
                        Dealership booking
                    </button>
                    <button
                        className="btn-warning btn"
                        onClick={() => setStarted(true)}
                    >
                        Customer direct booking
                    </button>
                </main>
            )}
        </>
    );
}

export default App;
