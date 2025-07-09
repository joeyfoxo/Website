// src/components/Facts.jsx
import React, { useEffect, useState } from 'react';
import PureCounter from '@srexi/purecounterjs';
import '../assets/css/style.css';
import BarChartLanguage from './BarChartLanguage.jsx';
import { Typography, useTheme } from '@mui/material';

export default function Facts() {
    const [repoCount, setRepoCount] = useState(0);
    const [yearsOfExperience, setYearsOfExperience] = useState(0.0);
    const [langCountData, setLangCountData] = useState([]);
    const username = 'joeyfoxo';

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const resp = await fetch(`https://api.github.com/users/${username}/repos`);
                const repos = await resp.json();
                if (!Array.isArray(repos)) return;

                const counts = {};
                repos.forEach((r) => {
                    if (r.language) {
                        counts[r.language] = (counts[r.language] || 0) + 1;
                    }
                });

                const total = repos.length;
                const data = Object.entries(counts).map(([language, count]) => ({
                    language,
                    count,
                    percentage: Math.round((count / total) * 1000) / 10,
                }));

                setRepoCount(total);
                setLangCountData(data);
            } catch (err) {
                console.error(err);
            }
        };

        const calcExperience = () => {
            const now = new Date();
            const start = new Date('2018-06-01');
            const msPerYear = 1000 * 60 * 60 * 24 * 365.25;
            const exp = (now - start) / msPerYear;
            setYearsOfExperience(parseFloat(exp.toFixed(2)));
        };

        fetchRepos();
        calcExperience();
    }, []);

    useEffect(() => {
        new PureCounter();
    }, [repoCount, yearsOfExperience, langCountData]);

    const totalPercentage = langCountData.reduce((sum, d) => sum + d.percentage, 0);
    const normalizedData = langCountData.map(d => ({
        ...d,
        percentage: (d.percentage / totalPercentage) * 100,
    }));

    const displayLanguages = normalizedData
        .filter((d) => d.percentage >= 5)
        .sort((a, b) => b.percentage - a.percentage)
        .map((d) => `${d.language} (${d.percentage.toFixed(0)}%)`);

    const theme = useTheme();

    return (
        <section id="facts" className="facts">
            <div className="container">
                <div className="row">
                    {/* Language Usage */}
                    <div className="col-lg-4 col-md-6 portfolio-item d-md-flex align-items-md-stretch" data-aos="fade-up">
                        <div className="count-box">
                            <i className="bi bi-code-slash"></i>
                            <Typography
                                component="h3"
                                className="purecounter"
                                data-purecounter-start="0"
                                data-purecounter-end={normalizedData.length}
                                data-purecounter-duration="1"
                                variant="h3"
                                sx={{
                                    color: theme.palette.textColors.span,
                                    pl: 7,
                                    fontWeight: 'bold',
                                }}
                            >
                                {normalizedData.length}
                            </Typography>
                            <Typography
                                sx={{ color: theme.palette.text.primary,
                                    fontWeight: 'Bold',}}
                            >
                                Known Programming Languages
                            </Typography>
                            <p><BarChartLanguage data={normalizedData} /></p>
                            <Typography
                                sx={{ color: theme.palette.text.primary,
                                    fontWeight: 'Bold',}}
                            >{displayLanguages.join(', ')}</Typography>
                            <Typography
                                sx={{ color: theme.palette.text.primary,
                                fontStyle: 'italic',}}
                            >Languages used in GitHub Projects</Typography>
                        </div>
                    </div>

                    {/* Projects */}
                    <div className="col-lg-4 col-md-6 portfolio-item d-md-flex align-items-md-stretch" data-aos="fade-up" data-aos-delay="100">
                        <div className="count-box">
                            <i className="bi bi-clipboard"></i>
                            <Typography
                                component="h3"
                                className="purecounter"
                                data-purecounter-start="0"
                                data-purecounter-end={repoCount}
                                data-purecounter-duration="1"
                                variant="h3"
                                sx={{
                                    color: theme.palette.textColors.span,
                                    pl: 7,
                                    fontWeight: 'bold',
                                }}
                            >
                                {repoCount}
                            </Typography>
                            <p><strong>Completed/Ongoing Projects</strong></p>
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="col-lg-4 col-md-6 portfolio-item d-md-flex align-items-md-stretch" data-aos="fade-up" data-aos-delay="200">
                        <div className="count-box">
                            <i className="bi bi-stars"></i>
                            <Typography
                                component="h3"
                                className="purecounter"
                                data-purecounter-start="0"
                                data-purecounter-end={yearsOfExperience}
                                data-purecounter-duration="1"
                                variant="h3"
                                sx={{
                                    color: theme.palette.textColors.span,
                                    pl: 7,
                                    fontWeight: 'bold',
                                }}
                            >
                                {yearsOfExperience.toFixed(1)}
                            </Typography>
                            <p><strong>Years of Experience</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}