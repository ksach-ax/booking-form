import "./app.css";
import { BookingForm } from "./booking_form";
import { useState } from "react";

function App() {
    const [step, setStep] = useState(0);

    return (
        <>
            <ul className="steps steps-vertical min-h-screen left-4 -z-10 md:hidden fixed">
                <li className="step step-primary" />
                <li className="step" />
                <li className="step" />
                <li className="step" />
            </ul>
            <main className="flex">
                <BookingForm />
            </main>
        </>
    );
}

export default App;
