import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import background from '/img/background.JPG';
import {Typography, useTheme} from "@mui/material"; // adjust path as needed

function HeroSection() {
    const typedRef = useRef();
    const theme = useTheme();

    useEffect(() => {
        const typed = new Typed(typedRef.current, {
            strings: ['Developer', 'Modder', 'Designer', 'Programmer'],
            typeSpeed: 100,
            backSpeed: 50,
            loop: true,
        });

        return () => typed.destroy();
    }, []);

    return (
        <section
            id="hero"
            className="d-flex flex-column justify-content-center align-items-center"
            style={{
                height: '100vh',
                background: `url(${background}) top center`,
                backgroundSize: 'cover'
            }}
        >
            <div className="hero-container" data-aos="fade-in">
                <Typography                     sx={{
                    color: theme.palette.textColors.primaryDark,
                }}>Joey</Typography>
                <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                        color: theme.palette.textColors.primaryDark,
                        '& span': {
                            paddingBottom: '4px',
                            letterSpacing: '1px',
                            borderBottom: `3px solid ${theme.palette.textColors.span}`,
                        },
                    }}
                >
                    <span ref={typedRef} />
                </Typography>
            </div>
        </section>
    );
}

export default HeroSection;