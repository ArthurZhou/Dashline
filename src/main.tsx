import ReactDOM from "react-dom/client";
import RootLayout from "./layout";
import Home from "./page";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <RootLayout children={<Home />} />
);
