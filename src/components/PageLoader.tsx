export default function PageLoader() {
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100vh",
            background: "#FBFAF5",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <style>{`
                @keyframes bizen-pulse {
                    0%, 100% { opacity: 0.4; transform: scale(1); }
                    50%       { opacity: 1; transform: scale(1.15); }
                }
                @keyframes bizen-fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .bizen-loader {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: bizen-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .bizen-loader-text {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                    letter-spacing: -0.05em;
                }
                .bizen-loader-dot {
                    width: 8px;
                    height: 8px;
                    background: #0F62FE;
                    border-radius: 50%;
                    animation: bizen-pulse 1.5s ease-in-out infinite;
                }
            `}</style>
            <div className="bizen-loader">
                <span className="bizen-loader-text">BIZEN</span>
                <div className="bizen-loader-dot" />
            </div>
        </div>
    )
}
