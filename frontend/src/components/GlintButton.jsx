import React, { useRef, useState } from 'react';

const GlintButton = () => {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [glintPos, setGlintPos] = useState({ x: 50, y: 50 });

    const handleOrientation = (event) => {
        const { gamma = 0, beta = 0 } = event;

        const x = Math.max(-45, Math.min(45, gamma)) / 45;
        const y = Math.max(-45, Math.min(45, beta)) / 45;

        const percentX = 50 + x * 50;
        const percentY = 50 + y * 50;

        setGlintPos({ x: percentX, y: percentY });
        console.log({ glintPos: { x: percentX, y: percentY } });
    };

    const requestPermission = async () => {
        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            try {
                const res = await DeviceOrientationEvent.requestPermission();
                if (res === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                    setPermissionGranted(true);
                } else {
                    alert('Permission denied for motion access');
                }
            } catch (err) {
                alert('Error requesting permission: ' + err.message);
            }
        } else {
            window.addEventListener('deviceorientation', handleOrientation, true);
            setPermissionGranted(true);
        }
    };

    const makeGlintLayer = (offsetX, offsetY, alpha = 0.4, radius = '150%') => {
        return `radial-gradient(circle at ${glintPos.x + offsetX}% ${glintPos.y + offsetY}%,
            rgba(255,255,255,${alpha}) 0%,
            rgba(255,255,255,0) ${radius})`;
    };

    const holographicGradient = `
        ${makeGlintLayer(0, 0)},
        ${makeGlintLayer(-20, -10, 0.3)},
        ${makeGlintLayer(15, 25, 0.25)},
        linear-gradient(135deg,
            #fffbcc 0%,
            #b5f3ff 25%,
            #e3b2ff 50%,
            #caffdd 75%,
            #ffd3f1 100%)
    `;

    return (
        <button
            onClick={() => {
                if (!permissionGranted) {
                    requestPermission();
                }
            }}
            style={{
                position: 'relative',
                padding: '1rem 3rem',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: '#222',
                borderRadius: '9999px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: holographicGradient,
                backgroundBlendMode: 'screen',
                backgroundSize: '200% 200%',
                backgroundRepeat: 'no-repeat',
                cursor: 'pointer',
                boxShadow: '0 0 25px rgba(255, 255, 255, 0.4)',
                transition: 'background-position 0.05s ease-out',
                overflow: 'hidden',
                WebkitTapHighlightColor: 'transparent',
            }}
        >
            ✨ Holographic Glint
        </button>
    );
};

export default GlintButton;