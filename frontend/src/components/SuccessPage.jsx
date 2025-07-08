const SuccessPage = () => {
    return (
        <div>
            {/* Mobile nav toggle button */}
            <i className="bi bi-list mobile-nav-toggle d-xl-none"></i>

            {/* Header */}
            <header id="header" className="pb-4">
                <div className="d-flex flex-column">

                    <div className="profile">
                        <a href="/"><img src="/img/icon.jpg" alt="Logo" className="img-fluid rounded-rectangle" /></a>
                        <h1 className="text-light"><a href="/">Joey</a></h1>
                        <div className="social-links mt-3 text-center">
                            <a href="/" target="_blank" rel="noopener noreferrer"><i className="bx bxl-linkedin"></i></a>
                            <a href="/"><i className="bx bx-envelope"></i></a>
                        </div>
                    </div>

                    <nav id="navbar" className="nav-menu navbar">
                        <ul>
                            <li><a href="#hero" className="nav-link scrollto active"><i className="bx bx-home"></i> <span>Home</span></a></li>
                            <li><a href="/" className="nav-link scrollto"><i className="bx bx-user"></i> <span>About</span></a></li>
                            <li><a href="/" className="nav-link scrollto"><i className="bx bx-file-blank"></i> <span>Resume</span></a></li>
                            <li><a href="/" className="nav-link scrollto"><i className="bx bx-briefcase"></i> <span>Projects</span></a></li>
                            <li><a href="/" className="nav-link scrollto"><i className="bx bx-envelope"></i> <span>Contact Me!</span></a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section id="hero" className="d-flex flex-column justify-content-center align-items-center">
                <div className="hero-container" data-aos="fade-in">
                    <h1>Successfully sent!</h1>
                </div>
            </section>
        </div>
    );
};

export default SuccessPage;