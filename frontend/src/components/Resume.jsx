import React from 'react';

function Resume() {
    return (
        <section id="resume" className="resume">
            <div className="container">
                <div className="section-title-resume">
                    <h2>Resume</h2>
                </div>

                <div className="resume-button-container">
                    <a href="/CV.pdf" target="_blank" rel="noreferrer">
                        <button className="rounded-button">CV</button>
                    </a>
                </div>

                <div className="row">
                    {/* Education */}
                    <div className="col-lg-6" data-aos="fade-up">
                        <h3 className="resume-title">Education</h3>
                        <div className="resume-item">
                            <h4>BSc Computer Science (Software Engineering)</h4>
                            <h5>2022 - 2025</h5>
                            <p>First Class Honors</p>
                            <p><em>Keele University, Newcastle</em></p>
                        </div>
                        <div className="resume-item">
                            <h4>A-Level Studies</h4>
                            <h5>2020 - 2022</h5>
                            <ul>
                                <li>Computer Science</li>
                                <li>Physics</li>
                                <li>Sociology</li>
                                <li>EPQ</li>
                            </ul>
                        </div>
                        <div className="resume-item">
                            <h4>GCSE Studies</h4>
                            <h5>2017 - 2020</h5>
                            <ul>
                                <li>Mathematics</li>
                                <li>English</li>
                                <li>Computer Science</li>
                                <li>Triple Science</li>
                                <li>Business Management</li>
                                <li>IT</li>
                            </ul>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                        <h3 className="resume-title">Experience</h3>
                        <div className="resume-item">
                            <h4>Gameplay Developer</h4>
                            <h5>2023 - 2024</h5>
                            <p><em>Ziax LTD (CubeCraft Games)</em></p>
                            <ul>
                                <li>Developed scalable Java-based Minecraft minigames for 4M+ monthly users</li>
                                <li>Implemented gameplay mechanics, performance optimizations, and bug fixes</li>
                                <li>Supported 14K+ daily concurrent players with peak loads of 42K</li>
                            </ul>
                        </div>
                        <div className="resume-item">
                            <h4>Software Engineer</h4>
                            <h5>2022 - 2025</h5>
                            <p><em>Furcation LTD</em></p>
                            <ul>
                                <li>Built scalable full-stack platform using TypeScript, React (Material UI), and Django</li>
                                <li>Deployed on GCP to serve 1000+ users with reliable performance</li>
                                <li>Collaborated on sustainable tech solutions and product delivery</li>
                            </ul>
                        </div>
                        <div className="resume-item">
                            <h4>Founder & Developer</h4>
                            <h5>2017</h5>
                            <p><em>SychoPvP</em></p>
                            <ul>
                                <li>Custom plugins, team leadership, user experience design</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Resume;