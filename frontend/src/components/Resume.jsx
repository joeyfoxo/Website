import React from 'react';
import {Typography, useTheme, Link, Box} from '@mui/material';
import { styled } from '@mui/material/styles';
import RoundedButton from "./button/RoundedButton.jsx";

// 1. Updated Styled Component with optional chaining to prevent crashes
const ThemedResumeItem = styled('div')(({ theme }) => ({
    padding: '0 0 20px 20px',
    marginTop: '-2px',
    // Fallback to primary main if textColors doesn't exist yet
    borderLeft: `2px solid ${theme.palette.textColors?.primaryDark || theme.palette.primary.main}`,
    position: 'relative',

    '& ul': {
        paddingLeft: '20px',
        marginTop: '10px',
        marginBottom: 0,
    },
    '& li': {
        marginBottom: '4px',
        color: theme.palette.text.primary,
        '& p, & span': {
            marginBottom: 0,
            display: 'inline',
        }
    },

    '&::before': {
        content: '""',
        position: 'absolute',
        width: '16px',
        height: '16px',
        borderRadius: '50px',
        left: '-9px',
        top: 0,
        background: theme.palette.background.paper || '#fff',
        border: `2px solid ${theme.palette.textColors?.primaryDark || theme.palette.primary.main}`,
    },
    '&:last-child': {
        paddingBottom: 0,
    },
}));

function Resume() {
    const theme = useTheme();

    // Safety check for your custom theme properties
    const textSpanColor = theme.palette.textColors?.span || theme.palette.text.secondary;
    const labelBgColor = theme.palette.textColors?.label || theme.palette.action.hover;

    const h5Styles = {
        backgroundColor: labelBgColor,
        padding: '5px 15px',
        display: 'inline-block',
        fontWeight: 600,
        marginBottom: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        color: textSpanColor
    };

    // Define renderList inside and use the local 'theme' variable directly
    const renderList = (items) => (
        <ul>
            {items.map((item, index) => (
                <Typography
                    key={index}
                    component="li"
                    variant="body"
                    sx={{ color: theme.palette.text.primary }}
                >
                    {item}
                </Typography>
            ))}
        </ul>
    );

    return (
        <section id="resume" className="resume">
            <div className="container">
                <div className="section-title-resume">
                    <Typography variant="h4" component="h2" sx={{ color: theme.palette.primary.main }}>Resume</Typography>
                </div>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '100%',
                        ml: { xs: 0, lg: '-140px' }
                    }}
                >
                    <Box sx={{ width: '150px' }}>
                        <RoundedButton href="/CV.pdf">
                            CV
                        </RoundedButton>
                    </Box>
                </Box>

                <div className="row">
                    <div className="col-lg-6" data-aos="fade-up">
                        <Typography sx={{ color: theme.palette.primary.main }} component="h3" className="resume-title">Education</Typography>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">BSc Computer Science (Software Engineering)</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>Sep 2022 - Jul 2025</Typography>
                            <Typography marginBottom={1} variant="body1">First Class Honours</Typography>
                            <Typography sx={{ color: textSpanColor }} marginBottom={1}><em>Keele University</em></Typography>
                        </ThemedResumeItem>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">A-Level Studies</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>Sep 2020 - Aug 2022</Typography>
                            <Typography sx={{ color: textSpanColor }} marginBottom={1}><em>Wolverhampton Royal School</em></Typography>
                            {renderList([
                                'Computer Science',
                                'Sociology',
                                'Physics'
                            ])}
                        </ThemedResumeItem>

                        <Typography sx={{ color: theme.palette.primary.main, mt: 4 }} component="h3" className="resume-title">Key Skills</Typography>
                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">Technical Expertise</Typography>
                            {renderList([
                                'Languages: Java, TypeScript, JavaScript, Python, C#, C++, Swift',
                                'Frameworks: React, Material UI, Django, Bukkit/Spigot, Shopify (Liquid)',
                                'Tools: Git, GitHub, VS Code, GitHub Copilot, Gemini, REST APIs, CI/CD, Jira, Linux',
                                'Strengths: Scalable backend, concurrency, OOP, performance tuning, production debugging'
                            ])}
                        </ThemedResumeItem>
                    </div>

                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                        <Typography sx={{ color: theme.palette.primary.main }} variant="h5" component="h3" className="resume-title">Professional Experience</Typography>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">Customer Service Assistant</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>Feb 2026 - May 2026</Typography>
                            <Typography sx={{ color: textSpanColor }} marginBottom={1}><em>Your Coop</em></Typography>
                            {renderList([
                                'Maintained high operational standards in a fast-paced retail environment, managing POS transactions and inventory replenishment.',
                                'Resolved complex customer queries and ensured business continuity through team collaboration.',
                                'Adhered to strict health and safety regulations to maintain a compliant work environment.'
                            ])}
                        </ThemedResumeItem>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">IT & Full Stack Software Engineer</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>Aug 2025 - Jan 2026</Typography>
                            <Typography sx={{ color: textSpanColor }} marginBottom={1}><em>Cue And Dart World</em></Typography>
                            {renderList([
                                'Built and maintained a full Shopify e-commerce platform with custom Liquid development and third-party integrations.',
                                'Developed middleware to synchronize POS, inventory, and online systems.',
                                'Managed on-site IT infrastructure across multiple retail locations.',
                                'Advised leadership on cost-effective technical improvements and delivered ongoing technical support.'
                            ])}
                        </ThemedResumeItem>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">Java Software Developer</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>Oct 2023 - Jan 2024</Typography>
                            <Typography sx={{ color: textSpanColor }} marginBottom={1}><em>CubeCraft Games (Ziax LTD)</em></Typography>
                            {renderList([
                                'Engineered Java-based game logic for systems supporting 4M monthly active users.',
                                'Leveraged specialized forks (CubeTap) to facilitate cross-play between Bedrock and Java editions.',
                                'Maintained server-side systems supporting 42,000 peak concurrent players.',
                                'Diagnosed and neutralized high-priority performance leaks and gameplay bugs on live production servers.'
                            ])}
                        </ThemedResumeItem>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">Software Developer</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>Jul 2022 - Jan 2025</Typography>
                            <Typography sx={{ color: textSpanColor }} marginBottom={1}><em>Furcation LTD</em></Typography>
                            {renderList([
                                'Collaborated within an agile team to build a registration system using TypeScript, React, and Django.',
                                'Designed PostgreSQL schemas to handle high-concurrency traffic for over 4,000 total users.',
                                'Engineered secure RESTful APIs with best practices for authentication and data validation.',
                                'Led iterative feature deployment based on user feedback to improve platform stability.'
                            ])}
                        </ThemedResumeItem>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Resume;