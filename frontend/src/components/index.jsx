import React, {useRef} from 'react';
import '../assets/css/style.css';
import { useEffect } from 'react';
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
import ModelViewer from "./util/ModelViewer.jsx";

    function Index() {
        useEffect(() => {
            AOS.init({duration: 1000});

            new Swiper('.swiper-container', {
                loop: true,
                autoplay: {delay: 2500},
            });

            GLightbox({selector: '.glightbox'});

            const isoGrid = document.querySelector('.isotope-container');
            if (isoGrid) {
                new Isotope(isoGrid, {
                    itemSelector: '.portfolio-item',
                    layoutMode: 'fitRows',
                });
            }
        }, []);

        return (
            <div>
                {/*<i className="bi bi-list mobile-nav-toggle d-xl-none"></i>*/}

                {/* ======= Header ======= */}
                <header id="header" className="pb-4">
                    <div className="d-flex flex-column">
                        <div className="profile">
                            <img src="/img/logo.png" alt="Logo" className="img-fluid rounded-rectangle"/>
                            <h1 className="text-light"><a href="#hero">Joey</a></h1>
                            <div className="social-links mt-3 text-center">
                                <a href="#form"><i className="bx bx-envelope"></i></a>
                            </div>
                        </div>

                        <nav id="navbar" className="nav-menu navbar">
                            <ul>
                                <li><a href="#hero" className="nav-link scrollto active"><i className="bx bx-home"></i>
                                    <span>Home</span></a></li>
                                <li><a href="#about" className="nav-link scrollto"><i className="bx bx-user"></i>
                                    <span>About</span></a></li>
                                <li><a href="#resume" className="nav-link scrollto"><i className="bx bx-file-blank"></i>
                                    <span>Resume</span></a></li>
                                <li><a href="#past-projects" className="nav-link scrollto"><i
                                    className="bx bx-briefcase"></i> <span>Projects</span></a></li>
                                {/*<li><a href="#form" className="nav-link scrollto"><i className="bx bx-envelope"></i>*/}
                                {/*    <span>Contact Me!</span></a></li>*/}
                            </ul>
                        </nav>
                    </div>
                </header>

                {/* ======= Hero Section ======= */}
                <HeroSection />

                <main id="main">
                    {/* ======= About Section ======= */}
                    <About />

                    {/* ======= Facts Section ======= */}
                    <Facts />

                    {/* ======= Resume Section ======= */}
                    <Resume />

                    {/* ======= Projects Section ======= */}
                    <Projects />
                </main>
            </div>
        );
}
export default Index;