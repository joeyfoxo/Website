import React from 'react';
import { Button, Link, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled resume-item with themed border
const ThemedResumeItem = styled('div')(({ theme }) => ({
    padding: '0 0 20px 20px',
    marginTop: '-2px',
    borderLeft: `2px solid ${theme.palette.textColors.primaryDark}`,
    position: 'relative',
    '&::before': {
        content: '""',
        position: 'absolute',
        width: '16px',
        height: '16px',
        borderRadius: '50px',
        left: '-9px',
        top: 0,
        background: '#fff',
        border: `2px solid ${theme.palette.textColors.primaryDark}`,
    },
    '&:last-child': {
        paddingBottom: 0,
    },
}));

function Resume() {
    const theme = useTheme();

    const h5Styles = {
        backgroundColor: theme.palette.textColors.label,
        padding: '5px 15px',
        display: 'inline-block',
        fontWeight: 600,
        marginBottom: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        color: theme.palette.textColors.span
    };

    return (
        <section id="resume" className="resume">
            <div className="container">
                <div className="section-title-resume">
                    <Typography variant="h4" component="h2" sx={{ color: theme.palette.primary.main }}>Resume</Typography>
                </div>

                <div className="resume-button-container">
                    <Link
                        component="a"
                        href="/CV.pdf"
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-button"
                        variant="outlined"
                        sx={{
                            textDecoration: 'none',
                            color: theme.palette.textColors.span,
                            border: `2px solid ${theme.palette.textColors.span}`,
                        }}
                    >
                        CV
                    </Link>
                </div>

                <div className="row">
                    {/* Education */}
                    <div className="col-lg-6" data-aos="fade-up">
                        <Typography sx={{ color: theme.palette.primary.main }} component="h3" className="resume-title">Education</Typography>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">BSc Computer Science (Software Engineering)</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>2022 - 2025</Typography>
                            <Typography sx={{ color: theme.palette.textColors.span }} marginBottom={1}>First Class Honors</Typography>
                            <Typography sx={{ color: theme.palette.textColors.span }} marginBottom={1}><em>Keele University, Newcastle</em></Typography>
                        </ThemedResumeItem>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">A-Level Studies</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>2020 - 2022</Typography>
                            <ul>
                                {['Computer Science', 'Physics', 'Sociology', 'EPQ'].map(subject => (
                                    <Typography key={subject} component="li" paragraph sx={{ color: theme.palette.text.primary }}>
                                        {subject}
                                    </Typography>
                                ))}
                            </ul>
                        </ThemedResumeItem>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">GCSE Studies</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>2017 - 2020</Typography>
                            <ul>
                                {[
                                    'Mathematics',
                                    'English',
                                    'Computer Science',
                                    'Triple Science',
                                    'Business Management',
                                    'IT'
                                ].map(subject => (
                                    <Typography key={subject} component="li" paragraph sx={{ color: theme.palette.text.primary }}>
                                        {subject}
                                    </Typography>
                                ))}
                            </ul>
                        </ThemedResumeItem>
                    </div>

                    {/* Experience */}
                    <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                        <Typography sx={{ color: theme.palette.primary.main }} variant="h5" component="h3" className="resume-title">Experience</Typography>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">Gameplay Developer</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>2023 - 2024</Typography>
                            <Typography sx={{ color: theme.palette.textColors.span }} marginBottom={1}><em>Ziax LTD (CubeCraft Games)</em></Typography>
                            <ul>
                                {[
                                    'Developed scalable Java-based Minecraft minigames for 4M+ monthly users',
                                    'Implemented gameplay mechanics, performance optimizations, and bug fixes',
                                    'Supported 14K+ daily concurrent players with peak loads of 42K'
                                ].map(item => (
                                    <Typography key={item} component="li" paragraph sx={{ color: theme.palette.text.primary }}>
                                        {item}
                                    </Typography>
                                ))}
                            </ul>
                        </ThemedResumeItem>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">Software Engineer</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>2022 - 2025</Typography>
                            <Typography sx={{ color: theme.palette.textColors.span }} marginBottom={1}><em>Furcation LTD</em></Typography>
                            <ul>
                                {[
                                    'Built scalable full-stack platform using TypeScript, React (Material UI), and Django',
                                    'Deployed on GCP to serve 1000+ users with reliable performance',
                                    'Collaborated on sustainable tech solutions and product delivery'
                                ].map(item => (
                                    <Typography key={item} component="li" paragraph sx={{ color: theme.palette.text.primary }}>
                                        {item}
                                    </Typography>
                                ))}
                            </ul>
                        </ThemedResumeItem>

                        <ThemedResumeItem className="resume-item">
                            <Typography variant="h6" component="h4">Founder & Developer</Typography>
                            <Typography component="h5" variant="subtitle2" sx={h5Styles}>2017</Typography>
                            <Typography sx={{ color: theme.palette.textColors.span }} marginBottom={1}><em>SychoPvP</em></Typography>
                            <ul>
                                <Typography component="li" paragraph sx={{ color: theme.palette.text.primary }}>
                                    Custom plugins, team leadership, user experience design
                                </Typography>
                            </ul>
                        </ThemedResumeItem>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Resume;