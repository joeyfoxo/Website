// main entry file (e.g., main.jsx or Index.jsx)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "boxicons/css/boxicons.min.css";
import "aos/dist/aos.css";
import "swiper/swiper-bundle.css";
import Index from "./components/Index.jsx";
import { ThemeContextProvider } from "./components/util/ThemeContext.jsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeContextProvider>
            <BrowserRouter>
                <Index />
            </BrowserRouter>
        </ThemeContextProvider>
    </StrictMode>
);