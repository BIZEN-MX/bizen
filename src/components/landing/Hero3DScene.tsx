"use client";

import React, { useEffect, useRef } from "react";

export default function Hero3DScene() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20;
            const y = (clientY / window.innerHeight - 0.5) * 20;

            containerRef.current.style.setProperty("--mouse-x", `${x}px`);
            containerRef.current.style.setProperty("--mouse-y", `${y}px`);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="hero-3d-scene-root"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                zIndex: 0,
                pointerEvents: "none",
            } as React.CSSProperties}
        >
            <style>{`
        .hero-3d-scene-root {
          --mouse-x: 0px;
          --mouse-y: 0px;
        }
        .blob {
          position: absolute;
          filter: blur(80px);
          border-radius: 50%;
          opacity: 0.6;
          mix-blend-mode: screen;
          transform: translate(var(--mouse-x), var(--mouse-y));
          transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1);
        }
        .blob-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, rgba(37, 99, 235, 0) 70%);
          top: -100px;
          right: -100px;
          animation: float 20s infinite alternate;
        }
        .blob-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0) 70%);
          bottom: -50px;
          left: -100px;
          animation: float-reverse 25s infinite alternate;
        }
        .blob-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%);
          top: 40%;
          left: 10%;
          animation: float 15s infinite alternate-reverse;
        }

        @keyframes float {
          0% { transform: translate(var(--mouse-x), var(--mouse-y)) scale(1); }
          100% { transform: translate(calc(var(--mouse-x) + 50px), calc(var(--mouse-y) - 30px)) scale(1.1); }
        }
        @keyframes float-reverse {
          0% { transform: translate(var(--mouse-x), var(--mouse-y)) rotate(0deg); }
          100% { transform: translate(calc(var(--mouse-x) - 40px), calc(var(--mouse-y) + 40px)) rotate(10deg); }
        }

        @media (max-width: 768px) {
          .blob {
            filter: blur(50px);
            opacity: 0.4;
          }
          .blob-1 { width: 300px; height: 300px; }
          .blob-2 { width: 250px; height: 250px; }
          .blob-3 { width: 200px; height: 200px; }
        }
      `}</style>
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
        </div>
    );
}
