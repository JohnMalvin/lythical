
"use client";

import { useEffect, useRef } from "react";
import "./Particles.css";

type ParticleShape = "circle" | "square" | "ring" | "sparkle";
type HoverEffect = "parallax" | "repel" | "attract";

export interface ParticlesProps {
    particleCount?: number;
    particleColors?: string[];
    particleSpread?: number;
    speed?: number;
    particleBaseSize?: number;
    sizeRandomness?: number;
    shape?: ParticleShape;
    glow?: number;
    twinkle?: number;
    moveParticlesOnHover?: boolean;
    hoverEffect?: HoverEffect;
    particleHoverFactor?: number;
    hoverRadius?: number;
    variation?: number;
    className?: string;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    phase: number;
}

export default function Particles({
    particleCount = 100,
    particleColors = ["#ffffff", "#9cec00", "#ec00a9"],
    particleSpread = 10,
    speed = 0.5,
    particleBaseSize = 2,
    sizeRandomness = 0.5,
    shape = "circle",
    glow = 0,
    twinkle = 0,
    moveParticlesOnHover = false,
    hoverEffect = "parallax",
    particleHoverFactor = 1,
    hoverRadius = 150,
    variation = 1,
    className = "",
}: ParticlesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;

        if (!container || !canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        let animationFrame = 0;
        let width = 0;
        let height = 0;
        let mouseX = -1000;
        let mouseY = -1000;
        let time = 0;

        const particles: Particle[] = [];
        const colors =
            particleColors.length > 0 ? particleColors : ["#ffffff"];

        const resizeCanvas = () => {
            const rect = container.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

            width = rect.width;
            height = rect.height;

            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        };

        const createParticles = () => {
            particles.length = 0;

            for (let i = 0; i < particleCount; i++) {
                const randomSize =
                    1 - sizeRandomness +
                    Math.random() * sizeRandomness;

                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * speed,
                    vy: (Math.random() - 0.5) * speed,
                    size:
                        particleBaseSize *
                        randomSize *
                        (1 + Math.random() * Math.max(0, variation) * 0.1),
                    color: colors[Math.floor(Math.random() * colors.length)],
                    phase: Math.random() * Math.PI * 2,
                });
            }
        };

        const drawParticle = (
            particle: Particle,
            isHovered: boolean,
        ) => {
            const pulse =
                1 -
                twinkle +
                twinkle *
                (0.5 + 0.5 * Math.sin(time + particle.phase));

            const size = Math.max(0.1, particle.size * pulse);
            const color = isHovered ? "#9cec00" : particle.color;

            context.save();
            context.globalAlpha = 0.8 * pulse;

            if (glow > 0 || isHovered) {
                context.shadowBlur = isHovered ? 15 : glow * 25;
                context.shadowColor = color;
            }

            context.fillStyle = color;
            context.strokeStyle = color;
            context.lineWidth = Math.max(1, size * 0.12);

            switch (shape) {
                case "square":
                    context.fillRect(
                        particle.x - size / 2,
                        particle.y - size / 2,
                        size,
                        size,
                    );
                    break;

                case "ring":
                    context.beginPath();
                    context.arc(
                        particle.x,
                        particle.y,
                        size / 2,
                        0,
                        Math.PI * 2,
                    );
                    context.stroke();
                    break;

                case "sparkle":
                    context.beginPath();
                    context.moveTo(particle.x - size, particle.y);
                    context.lineTo(particle.x + size, particle.y);
                    context.moveTo(particle.x, particle.y - size);
                    context.lineTo(particle.x, particle.y + size);
                    context.stroke();
                    break;

                default:
                    context.beginPath();
                    context.arc(
                        particle.x,
                        particle.y,
                        size / 2,
                        0,
                        Math.PI * 2,
                    );
                    context.fill();
            }

            context.restore();
        };

        const handlePointerMove = (event: PointerEvent) => {
            const rect = container.getBoundingClientRect();

            mouseX = event.clientX - rect.left;
            mouseY = event.clientY - rect.top;

            if (
                mouseX < 0 ||
                mouseY < 0 ||
                mouseX > rect.width ||
                mouseY > rect.height
            ) {
                mouseX = -1000;
                mouseY = -1000;
            }
        };

        const handlePointerLeave = () => {
            mouseX = -1000;
            mouseY = -1000;
        };

        const draw = () => {
            time += 0.04;
            context.clearRect(0, 0, width, height);

            const offsetX =
                moveParticlesOnHover && hoverEffect === "parallax"
                    ? (mouseX - width / 2) *
                    0.025 *
                    particleHoverFactor
                    : 0;

            const offsetY =
                moveParticlesOnHover && hoverEffect === "parallax"
                    ? (mouseY - height / 2) *
                    0.025 *
                    particleHoverFactor
                    : 0;

            for (const particle of particles) {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > width) {
                    particle.vx *= -1;
                }

                if (particle.y < 0 || particle.y > height) {
                    particle.vy *= -1;
                }

                if (moveParticlesOnHover && hoverEffect !== "parallax") {
                    const dx = particle.x - mouseX;
                    const dy = particle.y - mouseY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 0 && distance < hoverRadius) {
                        const direction =
                            hoverEffect === "repel" ? 1 : -1;

                        const force =
                            ((hoverRadius - distance) / hoverRadius) *
                            0.04 *
                            particleHoverFactor *
                            direction;

                        particle.x += (dx / distance) * force * 20;
                        particle.y += (dy / distance) * force * 20;
                    }
                }

                const originalX = particle.x;
                const originalY = particle.y;

                particle.x += offsetX;
                particle.y += offsetY;

                const dx = mouseX - particle.x;
                const dy = mouseY - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const isHovered =
                    distance < Math.max(particle.size, 8);

                drawParticle(particle, isHovered);

                particle.x = originalX;
                particle.y = originalY;
            }

            context.globalAlpha = 1;
            animationFrame = window.requestAnimationFrame(draw);
        };

        resizeCanvas();
        createParticles();

        const resizeObserver = new ResizeObserver(() => {
            resizeCanvas();
            createParticles();
        });

        resizeObserver.observe(container);

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerleave", handlePointerLeave);

        animationFrame = window.requestAnimationFrame(draw);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerleave", handlePointerLeave);
        };
    }, [
        particleCount,
        particleColors,
        particleSpread,
        speed,
        particleBaseSize,
        sizeRandomness,
        shape,
        glow,
        twinkle,
        moveParticlesOnHover,
        hoverEffect,
        particleHoverFactor,
        hoverRadius,
        variation,
    ]);

    return (
        <div
            ref={containerRef}
            className={`particles-container ${className}`}
        >
            <canvas
                ref={canvasRef}
                className="particles-canvas"
                aria-hidden="true"
            />
        </div>
    );
}
