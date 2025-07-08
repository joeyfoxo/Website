import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { a, useSpring } from '@react-spring/three';

function MinecraftModel() {
    const materials = useLoader(MTLLoader, '/3D/Hub/ExportWorld.mtl');
    materials.preload();

    const obj = useLoader(OBJLoader, '/3D/Hub/ExportWorld.obj', (loader) => {
        loader.setMaterials(materials);
    });

    return <primitive object={obj} />;
}

export default function ModelViewer() {
    const props = useSpring({
        // Rotation is flat (level), Y can rotate for spin if you want later
        rotation: [0, Math.PI, 0],
        scale: 1.0 ,
        position: [-10.5, -23, -87.5],
        config: { mass: 2, tension: 120, friction: 30 },
    });

    return (
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <a.group scale={props.scale} rotation={props.rotation} position={props.position}>
                        <MinecraftModel />
                    </a.group>
                </Suspense>
                <OrbitControls />
            </Canvas>
    );
}