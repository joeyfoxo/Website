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
import {Routes, Route, Navigate} from "react-router-dom";
import AuthPage from "./login/AuthPage.jsx";
import {AuthProvider, useAuth} from "./login/AuthContext.jsx";
import ProfilePage from "./login/ProfilePage.jsx";
import UserManagement from "./admin/UserManagement.jsx";
import AdminPanel from "./admin/AdminPanel.jsx";

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

/**
 * A simple wrapper to protect routes that require a login.
 * If the user isn't logged in, it sends them to the /auth page.
 */
const ProtectedRoute = ({ children }) => {

    const { user, loading } = useAuth(); // Ensure your context provides a 'loading' state
    const isAdminOrAbove = user && user.role.rank <= 1;

    if (loading) return <div>Checking session...</div>;
    if (!isAdminOrAbove) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default function Index() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/account" element={ <ProfilePage /> }/>

                <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>}>
                    <Route path="users" element={<UserManagement />} />
                </Route>

                {/* Add more routes inside the Provider as needed */}
            </Routes>
        </AuthProvider>
    );
}