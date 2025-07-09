import React, { useEffect, useState } from 'react';
import '../assets/css/style.css';
import AOS from 'aos';
import GLightbox from 'glightbox';
import Isotope from 'isotope-layout';
import Swiper from 'swiper';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import HeroSection from "./HeroSection.jsx";
import About from "./About.jsx";
import Facts from "./Facts.jsx";
import Resume from "./Resume.jsx";
import Projects from "./Projects.jsx";
import ThemeToggle from "./util/ThemeToggle.jsx";
import {
    CssBaseline,
    GlobalStyles,
    IconButton,
    useTheme,
    Box,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Header from "./Header.jsx";

function Index() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        AOS.init({ duration: 1000 });

        new Swiper('.swiper-container', {
            loop: true,
            autoplay: { delay: 2500 },
        });

        GLightbox({ selector: '.glightbox' });

        const isoGrid = document.querySelector('.isotope-container');
        if (isoGrid) {
            new Isotope(isoGrid, {
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows',
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
                    html: { height: '100%' },
                    body: { height: '100%', margin: 0, padding: 0 },
                    '#root': { height: '100%' },
                }}
            />

            <IconButton
                className="mobile-nav-toggle d-xl-none"
                onClick={toggleMobileNav}
                sx={{
                    position: 'fixed',
                    top: 15,
                    right: 15,
                    zIndex: 9999,
                    color: theme.palette.text.primary,
                }}
            >
                {mobileNavOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

            {/* Pass mobileNavOpen state to Header so it can control drawer if needed */}
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

export default Index;