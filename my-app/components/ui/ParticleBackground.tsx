
"use client";

import Particles from "@/components/ui/Particles/Particles";

export default function ParticleBackground() {
    return (
        <div className="particle-background" aria-hidden="true">
            <Particles
                particleColors={["#ffffff", "#ffffff", "#ec4899"]}
                particleCount={200}
                particleSpread={15}
                speed={1}
                particleBaseSize={5}
                glow={0.6}
                twinkle={0.6}
                moveParticlesOnHover
                hoverEffect="parallax"
                sizeRandomness={2}
                shape="circle"
                variation={10}
            />
        </div>
    );
}
