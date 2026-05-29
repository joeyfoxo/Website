import React from 'react';
import { useTheme } from '@mui/material';
import EditModeToggle from "./button/toggle/EditModeToggle.jsx";
import EditableText from "./util/EdittableText.jsx"; // Fixed spelling typo from your import

function About() {
    const theme = useTheme();

    return (
        <section id="about" className="about" style={{ position: 'relative' }}>
            <EditModeToggle />

            <div className="container">
                <div className="row">
                    <div className="col-lg-5" data-aos="fade-right">
                        <img src="/img/icon.jpg" className="rounded-less img-fluid" alt="Icon" />
                    </div>
                    <div className="col-lg-7 pt-4 pt-lg-0 content" data-aos="fade-left">

                        <EditableText
                            sectionId="about.welcome"
                            variant="h3"
                            component="h3"
                            gutterBottom
                            sx={{ color: theme.palette.textColors.span }}
                            defaultText="Welcome!"
                        />

                        <EditableText
                            sectionId="about.p1"
                            variant="body1"
                            paragraph
                            sx={{ color: theme.palette.text.primary }}
                            defaultText="I’m James, a creative and driven Software Engineer with over 7 years of programming experience and a First Class Honours degree in Computer Science (Software Engineering) from Keele University. My background combines deep expertise in Java-based game development with full-stack web engineering, specializing in delivering production-level software for platforms supporting millions of users."
                        />

                        <EditableText
                            sectionId="about.p2"
                            variant="body1"
                            paragraph
                            sx={{ color: theme.palette.text.primary }}
                            defaultText="Professionally, I served as a Java Software Developer at [CubeCraft Games](https://www.cubecraft.net) (Ziax LTD), where I engineered game logic and mechanics for a global network with 4M+ monthly active users. My work involved leveraging specialized Paper Spigot forks to facilitate cross-platform play for a peak of 42,000 concurrent players, while diagnosing and neutralizing high-priority performance leaks in a live environment."
                        />

                        <EditableText
                            sectionId="about.p3"
                            variant="body1"
                            paragraph
                            sx={{ color: theme.palette.text.primary }}
                            defaultText="I’ve also worked as a full-stack engineer at Furcation LTD, using React, TypeScript, and Django to build scalable platforms and PostgreSQL schemas designed for high-concurrency traffic. Beyond my professional roles, I’ve spearheaded complex personal projects like [KeeleMC](https://github.com/joeyfoxo/KeeleMC), a modular Minecraft server architecture utilizing a Velocity proxy gateway and PostgreSQL. I thrive in high-performing teams that value technical ownership and scalable backend solutions."
                        />

                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;