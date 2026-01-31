import "./app.css";
import { BookingForm } from "./booking_form";
import { useState } from "react";

function App() {
    const [step, setStep] = useState(0);

    return (
        <>
            <ul className="steps steps-vertical min-h-screen absolute left-4 -z-10 md:hidden">
                <li className="step step-primary" />
                <li className="step" />
                <li className="step" />
                <li className="step" />
            </ul>
            <main className="flex px-4">
                <BookingForm />
            </main>
        </>
    );
}

export default App;
