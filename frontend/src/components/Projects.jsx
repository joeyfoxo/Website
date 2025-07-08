import React, { useState, useEffect, useRef } from 'react';
import ModelViewer from "./util/ModelViewer.jsx";
import '../assets/css/style.css';

function Projects() {
    const [showModel, setShowModel] = useState(false);
    const [fadeProjects, setFadeProjects] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const countdownRef = useRef(null);

    const handleZoom = () => {
        setFadeProjects(true);
        setTimeout(() => {
            setExpanded(true);
            setTimeout(() => setShowModel(true), 100);
        }, 600);
    };

    const handleBack = () => {
        setShowModel(false);
        setExpanded(false);
        setFadeProjects(false);
        setCountdown(null);
        clearInterval(countdownRef.current);
    };

    const startCountdown = () => {
        if (countdownRef.current) return; // prevent multiple timers
        let count = 3;
        setCountdown(count);
        countdownRef.current = setInterval(() => {
            count -= 1;
            if (count === 0) {
                clearInterval(countdownRef.current);
                countdownRef.current = null;
                handleBack();
            } else {
                setCountdown(count);
            }
        }, 1000);
    };

    const cancelCountdown = () => {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        setCountdown(null);
    };

    return (
        <section id="past-projects" className="past-projects">
            <div className="container">
                <div className="section-title-resume">
                    <h2>Personal Projects</h2>
                </div>

                <div className={`projects-grid ${fadeProjects && !expanded ? 'fade-out' : ''}`}>
                    {!expanded && (
                        <>
                            {/* KeeleMC project box content when NOT expanded */}
                            <div
                                className="project-box keelemc-box"
                                onClick={handleZoom}
                                style={{ cursor: 'pointer', position: 'relative' }}
                            >
                                <div className="interactive-label">
                                    Interactive: click to see 3D world
                                </div>
                                <img src="/img/projects/keelemc.png" className="img-fluid" />
                                <div className="project-info">
                                    <h4>KeeleMC</h4>
                                    <p>
                                        A paper server built from the ground up with custom java plugins including a dedicated core, hub and gamemode plugins.
                                    </p>
                                    <a href="https://github.com/Joeyfoxo/keelemc" className="rounded-button-red" target="_blank" rel="noreferrer">GitHub</a>
                                </div>
                            </div>

                            {/* Other projects */}
                            <div className="project-box">
                                <img src="/img/projects/shields.png" className="img-fluid" />
                                <div className="project-info">
                                    <h4>Mo Shields</h4>
                                    <p>moShield is a custom Minecraft plugin for Paper Spigot, written in Java. It
                                        adds multiple shields, each with unique abilities that activate when attacked or
                                        interacted with.</p>
                                    <a href="https://github.com/Joeyfoxo/moShield" className="rounded-button-red" target="_blank" rel="noreferrer">GitHub</a>
                                </div>
                            </div>

                            <div className="project-box">
                                <img src="/img/projects/pubgolf.jpeg" className="img-fluid" />
                                <div className="project-info">
                                    <h4>Pub Golf 2</h4>
                                    <p>A personal project for friends, a simple Swift app which allows easy tracking
                                        for the common UK game Pub Golf. It contains penalties, tasks and complex UI.</p>
                                    <a href="https://github.com/joeyfoxo/PubGolf2" className="rounded-button-red" target="_blank" rel="noreferrer">GitHub</a>
                                </div>
                            </div>

                            <div className="project-box">
                                <img src="/img/projects/gameconcept.jpeg" className="img-fluid" />
                                <div className="project-info">
                                    <h4>C++ Game Concept</h4>
                                    <p>For education I designed a basic C++ application using openFrameworks
                                        and ODE. I plan to redo this in a better engine.</p>
                                    <a href="https://github.com/joeyfoxo/GameConcept" className="rounded-button-red" target="_blank" rel="noreferrer">GitHub</a>
                                </div>
                            </div>

                            <div className="project-box">
                                <img src="/img/projects/rat.png" className="img-fluid" />
                                <div className="project-info">
                                    <h4>Remote Access Trojan</h4>
                                    <p>A very early project written in C# which communicates to a server and
                                        transfers data. If continued I would have developed this into an example of a RAT.</p>
                                    <a href="https://github.com/joeyfoxo/FxRAT" className="rounded-button-red" target="_blank" rel="noreferrer">GitHub</a>
                                </div>
                            </div>

                            <div className="project-box">
                                <img src="/img/projects/diss.png" className="img-fluid" />
                                <div className="project-info">
                                    <h4>Dissertation</h4>
                                    <p>Analysing the use of obfuscation in malware to evade detection and trigger execution</p>
                                    <p>This dissertation examines how Windows malware uses obfuscation and evasion techniques to bypass EDR systems and antivirus software.
                                        The research highlights the need for adaptive detection strategies to counter increasingly obfuscated threats.</p>
                                    <a href="/Dissertation.pdf" className="rounded-button-red" target="_blank" rel="noreferrer">Dissertation</a>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Expanded KeeleMC model viewer */}
                    {expanded && (
                        <div
                            className="project-box keelemc-box expanded-model"
                            onMouseLeave={startCountdown}
                            onMouseEnter={cancelCountdown}
                        >
                            <div className="model-container model-section">
                                <ModelViewer />
                                <div className="back-button-container">
                                    <button className="back-button" onClick={handleBack}>
                                        ← Back to Projects
                                    </button>
                                </div>
                                {countdown !== null && (
                                    <div className="countdown-overlay">
                                        <p>Closing 3D Render in {countdown}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Projects;