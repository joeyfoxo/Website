import React from 'react';
import { Typography, useTheme, Link } from '@mui/material';

function About() {
    const theme = useTheme();

    return (
        <section id="about" className="about">
            <div className="container">
                <div className="row">
                    <div className="col-lg-5" data-aos="fade-right">
                        <img src="/img/icon.jpg" className="rounded-less img-fluid" alt="Icon" />
                    </div>
                    <div className="col-lg-7 pt-4 pt-lg-0 content" data-aos="fade-left">
                        <Typography
                            variant="h3"
                            component="h3"
                            gutterBottom
                            sx={{ color: theme.palette.textColors.span }}
                        >
                            Welcome!
                        </Typography>

                        <Typography
                            paragraph
                            sx={{ color: theme.palette.text.primary }}
                        >
                            I’m James, a creative and driven Software Engineer with over 7 years of programming experience and a
                            First Class Honours degree in Computer Science (Software Engineering) from Keele University.
                            My background combines deep expertise in Java-based game development with full-stack web engineering,
                            specializing in delivering production-level software for platforms supporting millions of users.
                        </Typography>

                        <Typography
                            paragraph
                            sx={{ color: theme.palette.text.primary }}
                        >
                            Professionally, I served as a Java Software Developer at{' '}
                            <Link
                                href="https://www.cubecraft.net"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: theme.palette.textColors.link }}
                            >
                                CubeCraft Games
                            </Link>{' '}
                            (Ziax LTD), where I engineered game logic and mechanics for a global network with 4M+ monthly active users.
                            My work involved leveraging specialized Paper Spigot forks to facilitate cross-platform play for a peak
                            of 42,000 concurrent players, while diagnosing and neutralizing high-priority performance leaks in a live environment.
                        </Typography>

                        <Typography
                            paragraph
                            sx={{ color: theme.palette.text.primary }}
                        >
                            I’ve also worked as a full-stack engineer at Furcation LTD, using React, TypeScript, and Django to build
                            scalable platforms and PostgreSQL schemas designed for high-concurrency traffic. Beyond my professional roles,
                            I’ve spearheaded complex personal projects like{' '}
                            <Link
                                href="https://github.com/joeyfoxo/KeeleMC"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: theme.palette.textColors.link }}
                            >
                                KeeleMC
                            </Link>, a modular Minecraft server architecture utilizing a Velocity proxy gateway and PostgreSQL.
                            I thrive in high-performing teams that value technical ownership and scalable backend solutions.
                        </Typography>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;