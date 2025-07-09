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
                            sx={{ color: theme.palette.primary.main }}
                        >
                            Welcome!
                        </Typography>

                        <Typography
                            paragraph
                            sx={{ color: theme.palette.text.primary }}
                        >
                            I’m Joey, a creative and driven software developer with over 7 years of programming experience,
                            including 5 years working with the Bukkit/Spigot API. I have a strong passion for building engaging
                            and high-quality digital experiences, with a particular interest in game development and full-stack web applications.
                            While much of my work has been voluntary and alongside my academic studies, I’ve contributed meaningfully
                            to collaborative teams and delivered production-level software for real-world users.
                        </Typography>

                        <Typography
                            paragraph
                            sx={{ color: theme.palette.text.primary }}
                        >
                            Professionally, I’ve developed large-scale Minecraft minigames at{' '}
                            <Link
                                href="https://www.cubecraft.net"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: theme.palette.textColors.link }}
                            >
                                CubeCraft Games
                            </Link>{' '}
                            (Ziax LTD), helping to support a peak of over 42,000 concurrent players.
                            I’ve also worked as a full-stack engineer at Furcation LTD, using React, TypeScript, Django, and GCP
                            to build scalable platforms serving 1,000+ users. I’m experienced in
                            concurrent programming, Git, and working under pressure, and I thrive in high-performing, self-motivated teams.
                        </Typography>

                        <Typography
                            paragraph
                            sx={{ color: theme.palette.text.primary }}
                        >
                            I’ve recently finished pursuing a BSc in Computer Science (Software Engineering) at Keele University,
                            where I’m on track for First Class Honours. Alongside my studies, I’ve worked on personal projects such as{' '}
                            <Link
                                href="https://github.com/joeyfoxo/KeeleMC"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: theme.palette.textColors.link }}
                            >
                                KeeleMC
                            </Link>, a Minecraft server plugin suite designed as an all-in-one solution for a large-scale server,
                            alongside other projects seen further below!
                        </Typography>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;