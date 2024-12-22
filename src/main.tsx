import React from "react";
import ReactDOM from "react-dom/client";
import RootLayout from "./layout";
import Home from "./page";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RootLayout children={<Home />} />
    </React.StrictMode>,
);
