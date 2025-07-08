import React from 'react';
import '../assets/css/style.css';

export default function BarChartLanguage({ data }) {
    return (
        <div className="lang-bar-container">
            {data.map((d, i) => (
                <div
                    key={d.language}
                    className="lang-bar-segment tooltip"
                    data-tooltip={`${d.language}: ${d.percentage}%`}
                    style={{
                        width: `${d.percentage}%`,
                        backgroundColor: `hsl(${(i * 70) % 360}, 65%, 55%)`
                    }}
                >

                </div>
            ))}
        </div>
    );
}