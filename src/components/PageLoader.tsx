import { motion } from "framer-motion"

export default function PageLoader() {
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100vh",
            background: "#FBFAF5",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <style>{`
                @keyframes billy-float {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-8px); }
                }
                @keyframes billy-fade-in {
                    from { opacity: 0; transform: scale(0.88) translateY(12px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes loader-bar-fill {
                    0%   { width: 0%; }
                    60%  { width: 70%; }
                    80%  { width: 85%; }
                    100% { width: 100%; }
                }
                @keyframes loader-pulse-ring {
                    0%   { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                .billy-loader-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 28px;
                    animation: billy-fade-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .billy-bull-wrap {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .billy-bull-svg {
                    animation: billy-float 2.6s ease-in-out infinite;
                    filter: drop-shadow(0 12px 20px rgba(15, 98, 254, 0.22));
                }
                .billy-pulse-ring {
                    position: absolute;
                    width: 56px; height: 56px;
                    border-radius: 50%;
                    background: rgba(15, 98, 254, 0.12);
                    animation: loader-pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                .billy-loader-track {
                    width: 140px;
                    height: 3px;
                    background: rgba(15, 98, 254, 0.1);
                    border-radius: 99px;
                    overflow: hidden;
                }
                .billy-loader-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #0B71FE, #4A9EFF);
                    border-radius: 99px;
                    animation: loader-bar-fill 1.8s cubic-bezier(0.4, 0, 0.2, 1) both;
                }
                .billy-loader-text {
                    font-size: 12px;
                    font-weight: 600;
                    color: #94a3b8;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-top: -16px;
                }
            `}</style>

            <div className="billy-loader-content">
                {/* Billy the bull animated mascot */}
                <div className="billy-bull-wrap">
                    <div className="billy-pulse-ring" />
                    <svg className="billy-bull-svg" width="72" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Body */}
                        <ellipse cx="40" cy="46" rx="22" ry="20" fill="#1B6EFE" />
                        {/* Head */}
                        <circle cx="40" cy="27" r="17" fill="#1B6EFE" />
                        {/* Horns */}
                        <path d="M25 14 Q18 4 14 8 Q18 14 23 18Z" fill="#0D52C8" />
                        <path d="M55 14 Q62 4 66 8 Q62 14 57 18Z" fill="#0D52C8" />
                        {/* Face highlight */}
                        <ellipse cx="40" cy="30" rx="10" ry="9" fill="#4A9EFF" opacity="0.35" />
                        {/* Eyes */}
                        <circle cx="34" cy="24" r="4" fill="white" />
                        <circle cx="46" cy="24" r="4" fill="white" />
                        <circle cx="35" cy="25" r="2" fill="#0a1929" />
                        <circle cx="47" cy="25" r="2" fill="#0a1929" />
                        {/* Eye shine */}
                        <circle cx="36" cy="24" r="0.8" fill="white" />
                        <circle cx="48" cy="24" r="0.8" fill="white" />
                        {/* Nose */}
                        <ellipse cx="40" cy="33" rx="5" ry="3.5" fill="#0D52C8" opacity="0.6" />
                        <circle cx="37.5" cy="33" r="1.2" fill="#0a1929" opacity="0.7" />
                        <circle cx="42.5" cy="33" r="1.2" fill="#0a1929" opacity="0.7" />
                        {/* Smile */}
                        <path d="M35 37 Q40 41 45 37" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
                        {/* Ears */}
                        <ellipse cx="22" cy="26" rx="4" ry="5.5" fill="#1B6EFE" />
                        <ellipse cx="58" cy="26" rx="4" ry="5.5" fill="#1B6EFE" />
                        <ellipse cx="22" cy="26" rx="2" ry="3.5" fill="#4A9EFF" opacity="0.4" />
                        <ellipse cx="58" cy="26" rx="2" ry="3.5" fill="#4A9EFF" opacity="0.4" />
                        {/* Arms */}
                        <ellipse cx="18" cy="50" rx="6" ry="9" fill="#1B6EFE" transform="rotate(-15 18 50)" />
                        <ellipse cx="62" cy="50" rx="6" ry="9" fill="#1B6EFE" transform="rotate(15 62 50)" />
                    </svg>
                </div>

                {/* Progress bar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <div className="billy-loader-track">
                        <div className="billy-loader-bar" />
                    </div>
                    <span className="billy-loader-text">Cargando</span>
                </div>
            </div>
        </div>
    )
}
