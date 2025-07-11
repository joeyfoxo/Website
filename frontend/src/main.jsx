import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.min.css';
import 'aos/dist/aos.css';
import 'swiper/swiper-bundle.css';
import Index from "./components/index.jsx";
import {ThemeContextProvider} from "./components/util/ThemeContext.jsx";

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <Index />
  </ThemeContextProvider>,
)
