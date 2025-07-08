import { useState, useEffect } from 'react';

const useDeviceOrientation = () => {
    const [orientation, setOrientation] = useState({ x: 50, y: 50 });
    const [gyroEnabled, setGyroEnabled] = useState(false);

    useEffect(() => {
        const handleOrientation = (event) => {
            const gamma = event.gamma || 0;
            const beta = event.beta || 0;

            const x = Math.min(Math.max((gamma + 90) / 180 * 100, 0), 100);
            const y = Math.min(Math.max((beta + 180) / 360 * 100, 0), 100);

            setOrientation({ x, y });
        };

        const setupOrientation = () => {
            window.addEventListener('deviceorientation', handleOrientation);
            setGyroEnabled(true);
        };

        if (
            typeof DeviceOrientationEvent !== 'undefined' &&
            typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
            DeviceOrientationEvent.requestPermission()
                .then((response) => {
                    if (response === 'granted') {
                        setupOrientation();
                    } else {
                        console.warn('Gyroscope access denied.');
                    }
                })
                .catch((error) => {
                    console.error('DeviceOrientation error:', error);
                });
        } else {
            setupOrientation();
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return { orientation, gyroEnabled };
};

export default useDeviceOrientation;
