import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import background from '/img/background.JPG'; // adjust path as needed

function HeroSection() {
    const typedRef = useRef();

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
                <p>Joey</p>
                <h1><span ref={typedRef}></span></h1>
            </div>
        </section>
    );
}

export default HeroSection;