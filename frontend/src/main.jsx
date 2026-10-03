import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App.jsx";
import "./index.css";

function renderApp() {
    const rootElement =
        document.getElementById("root");

    if (!rootElement) {
        throw new Error(
            "Root element was not found."
        );
    }

    createRoot(rootElement).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}

renderApp();