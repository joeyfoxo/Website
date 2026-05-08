// components/Index.jsx
import React, { useEffect, useState } from "react";
import {
    CssBaseline,
    GlobalStyles,
    IconButton,
    useTheme,
    Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AOS from "aos";
import GLightbox from "glightbox";
import Isotope from "isotope-layout";
import Swiper from "swiper";
import Header from "./Header.jsx";
import HeroSection from "./HeroSection.jsx";
import About from "./About.jsx";
import Facts from "./Facts.jsx";
import Resume from "./Resume.jsx";
import Projects from "./Projects.jsx";
import { Routes, Route } from "react-router-dom";
import AuthPage from "./login/AuthPage.jsx";

function Home() {
    // This is your original homepage content
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        AOS.init({ duration: 1000 });

        new Swiper(".swiper-container", {
            loop: true,
            autoplay: { delay: 2500 },
        });

        GLightbox({ selector: ".glightbox" });

        const isoGrid = document.querySelector(".isotope-container");
        if (isoGrid) {
            new Isotope(isoGrid, {
                itemSelector: ".portfolio-item",
                layoutMode: "fitRows",
            });
        }
    }, []);

    const toggleMobileNav = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    return (
        <>
            <CssBaseline />
            <GlobalStyles
                styles={{
                    html: { height: "100%" },
                    body: { height: "100%", margin: 0, padding: 0 },
                    "#root": { height: "100%" },
                }}
            />

            <IconButton
                className="mobile-nav-toggle d-xl-none"
                onClick={toggleMobileNav}
                sx={{
                    position: "fixed",
                    top: 15,
                    right: 15,
                    zIndex: 9999,
                    color: theme.palette.text.primary,
                }}
            >
                {mobileNavOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            <Header mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />

            <Box component="main" id="main">
                <HeroSection />
                <About />
                <Facts />
                <Resume />
                <Projects />
            </Box>
        </>
    );
}

export default function Index() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* You can add more routes here */}
        </Routes>
    );
}