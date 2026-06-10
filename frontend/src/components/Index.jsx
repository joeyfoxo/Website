// components/Index.jsx
import React, {useEffect, useState} from "react";
import {Box, CssBaseline, GlobalStyles, IconButton, useTheme,} from "@mui/material";
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
import {Navigate, Route, Routes} from "react-router-dom";
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
const ProtectedRoute = ({ children, requiredRank }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Checking session...</div>;

    // 1. If there is no user at all, send them to the login screen
    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // 2. If they are logged in, check their authorization level
    const canAccess = user?.role?.rank <= requiredRank;

    if (!canAccess) {
        // Logged in but insufficient permissions -> kick back to home
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

                {/* Protected User Profile Route */}
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute requiredRank={5}>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Admin/Layout Section */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRank={4}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                >
                    {/* Highly Restricted Child Route */}
                    <Route
                        path="users"
                        element={
                            <ProtectedRoute requiredRank={1}>
                                <UserManagement />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </AuthProvider>
    );
}