import React, { useState, useEffect, useRef } from 'react';
import ModelViewer from "./util/ModelViewer.jsx";
import '../assets/css/style.css';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useTheme} from "@mui/material";
import RoundedButton from "./button/RoundedButton.jsx";

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
        if (countdownRef.current) return;
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

    const theme = useTheme();

    return (
        <section id="past-projects" className="past-projects">
            <div className="container">
                <div className="section-title-resume">
                    <Typography variant="h4" component="h2" sx={{ color: theme.palette.primary.main }}>Personal Projects</Typography>
                </div>

                {/* Responsive grid container using Box and CSS grid */}
                <Box
                    className={`projects-grid ${fadeProjects && !expanded ? 'fade-out' : ''}`}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',       // mobile: 1 column
                            sm: 'repeat(2, 1fr)', // small tablets: 2 columns
                            md: 'repeat(3, 1fr)', // desktop: 3 columns (or your original)
                        },
                        gap: 2,
                    }}
                >
                    {!expanded && (
                        <>
                            {/* KeeleMC project box */}
                            <div className="project-box keelemc-box" onClick={handleZoom} style={{ cursor: 'pointer', position: 'relative' }}>
                                <div className="interactive-label">Interactive: click to see 3D world</div>
                                <img src="/img/projects/keelemc.png" className="img-fluid" alt="KeeleMC" />
                                <div className="project-info">
                                    <Typography variant="h4" component="h4">KeeleMC</Typography>
                                    <Typography component="p" paragraph>
                                        A paper server built from the ground up with custom java plugins including a dedicated core, hub and gamemode plugins.
                                    </Typography>
                                    <RoundedButton href="https://github.com/Joeyfoxo/keelemc">GitHub</RoundedButton>
                                </div>
                            </div>

                            <div className="project-box">
                                <img src="/img/projects/shields.png" className="img-fluid" alt="Mo Shields" />
                                <div className="project-info">
                                    <Typography variant="h4" component="h4">Mo Shields</Typography>
                                    <Typography component="p" paragraph>
                                        moShield is a custom Minecraft plugin for Paper Spigot, written in Java. It adds multiple shields, each with unique abilities that activate when attacked or interacted with.
                                    </Typography>
                                    <RoundedButton href="https://github.com/joeyfoxo/moShield">GitHub</RoundedButton>
                                </div>
                            </div>

                            <div className="project-box">
                                <img src="/img/projects/pubgolf.jpeg" className="img-fluid" alt="Pub Golf 2" />
                                <div className="project-info">
                                    <Typography variant="h4" component="h4">Pub Golf 2</Typography>
                                    <Typography component="p" paragraph>
                                        A personal project for friends, a simple Swift app which allows easy tracking for the common UK game Pub Golf. It contains penalties, tasks and complex UI.
                                    </Typography>
                                    <RoundedButton href="https://github.com/joeyfoxo/PubGolf2">GitHub</RoundedButton>
                                </div>
                            </div>

                            <div className="project-box">
                                <img src="/img/projects/gameconcept.jpeg" className="img-fluid" alt="C++ Game Concept" />
                                <div className="project-info">
                                    <Typography variant="h4" component="h4">C++ Game Concept</Typography>
                                    <Typography component="p" paragraph>
                                        For education I designed a basic C++ application using openFrameworks and ODE. I plan to redo this in a better engine.
                                    </Typography>
                                    <RoundedButton href="https://github.com/joeyfoxo/GameConcept">GitHub</RoundedButton>
                                </div>
                            </div>

                            <div className="project-box">
                                <img src="/img/projects/rat.png" className="img-fluid" alt="Remote Access Trojan" />
                                <div className="project-info">
                                    <Typography variant="h4" component="h4">Remote Access Trojan</Typography>
                                    <Typography component="p" paragraph>
                                        A very early project written in C# which communicates to a server and transfers data. If continued I would have developed this into an example of a RAT.
                                    </Typography>
                                    <RoundedButton href="https://github.com/joeyfoxo/FxRAT">GitHub</RoundedButton>
                                </div>
                            </div>

                            <div className="project-box">
                                <img src="/img/projects/diss.png" className="img-fluid" alt="Dissertation" />
                                <div className="project-info">
                                    <Typography variant="h4" component="h4">Dissertation</Typography>
                                    <Typography component="p" paragraph>
                                        Analysing the use of obfuscation in malware to evade detection and trigger execution
                                    </Typography>
                                    <Typography component="p" paragraph>
                                        This dissertation examines how Windows malware uses obfuscation and evasion techniques to bypass EDR systems and antivirus software. The research highlights the need for adaptive detection strategies to counter increasingly obfuscated threats.
                                    </Typography>
                                    <RoundedButton href="/Dissertation.pdf">Dissertation</RoundedButton>
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
                                        <Typography>Closing 3D Render in {countdown}</Typography>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Box>
            </div>
        </section>
    );
}

export default Projects;