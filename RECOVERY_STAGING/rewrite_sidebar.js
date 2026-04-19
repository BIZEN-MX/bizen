const fs = require('fs');

const file = '/Users/diegopenasanchez/BIZEN/src/components/FixedSidebar.tsx';
const data = fs.readFileSync(file, 'utf8');

const startMarker = '{/* Quick Actions */}';
const endMarker = '{/* User Profile Footer */}';

const startIndex = data.indexOf(startMarker);
const endIndex = data.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find markers");
    process.exit(1);
}

const replacement = `{/* Quick Actions */}
          {mounted && (
            <div style={{ marginBottom: 24, flex: "1 1 auto" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: stackAlignment }}>
                {/* ── INICIO / Dashboard ── */}
                {user && (
                    <button
                    onClick={() => navigateTo("/dashboard")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px",
                        background: isCompactSidebar ? "transparent" : (pathname === "/dashboard" ? "rgba(11, 113, 254, 0.12)" : "transparent"),
                        border: "none",
                        borderRadius: 10,
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontSize: 14,
                        fontWeight: pathname === "/dashboard" ? 700 : 500,
                        textAlign: "left",
                        color: pathname === "/dashboard" ? "#0B71FE" : "#64748B",
                        ...compactButtonOverrides(pathname === "/dashboard"),
                        position: "relative",
                        overflow: "hidden",
                        boxShadow: pathname === "/dashboard" ? "0 4px 12px rgba(11, 113, 254, 0.12)" : "none"
                    }}
                    onMouseEnter={(e) => {
                        if (!isCompactSidebar) {
                        e.currentTarget.style.background = pathname === "/dashboard" ? "rgba(11, 113, 254, 0.18)" : "#F1F5F9"
                        e.currentTarget.style.color = "#0B71FE"
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isCompactSidebar) {
                        e.currentTarget.style.background = pathname === "/dashboard" ? "rgba(11, 113, 254, 0.12)" : "transparent"
                        e.currentTarget.style.color = pathname === "/dashboard" ? "#0B71FE" : "#64748B"
                        }
                    }}
                    >
                    {pathname === "/dashboard" && (
                        <div style={{ position: "absolute", left: 0, top: "15%", height: "70%", width: "4px", backgroundColor: "#0B71FE", borderRadius: "0 4px 4px 0" }} />
                    )}
                    <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={pathname === "/dashboard" ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    <span className="nav-item-label">Inicio</span>
                    </button>
                )}

                {/* ── ACADEMIA ── */}
                {isStudentOrGuest && (
                    <button
                        onClick={() => navigateTo("/academia")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 16px",
                            background: isCompactSidebar ? "transparent" : (pathname.startsWith("/academia") || pathname.startsWith("/courses") ? "rgba(11, 113, 254, 0.12)" : "transparent"),
                            border: "none",
                            borderRadius: 10,
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            fontSize: 14,
                            fontWeight: (pathname.startsWith("/academia") || pathname.startsWith("/courses")) ? 700 : 500,
                            textAlign: "left",
                            color: (pathname.startsWith("/academia") || pathname.startsWith("/courses")) ? "#0B71FE" : "#64748B",
                            ...compactButtonOverrides(pathname.startsWith("/academia") || pathname.startsWith("/courses")),
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: (pathname.startsWith("/academia") || pathname.startsWith("/courses")) ? "0 4px 12px rgba(11, 113, 254, 0.12)" : "none"
                        }}
                        onMouseEnter={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = (pathname.startsWith("/academia") || pathname.startsWith("/courses")) ? "rgba(11, 113, 254, 0.18)" : "#F1F5F9"
                                e.currentTarget.style.color = "#0B71FE"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = (pathname.startsWith("/academia") || pathname.startsWith("/courses")) ? "rgba(11, 113, 254, 0.12)" : "transparent"
                                e.currentTarget.style.color = (pathname.startsWith("/academia") || pathname.startsWith("/courses")) ? "#0B71FE" : "#64748B"
                            }
                        }}
                    >
                        {(pathname.startsWith("/academia") || pathname.startsWith("/courses")) && (
                            <div style={{ position: "absolute", left: 0, top: "15%", height: "70%", width: "4px", backgroundColor: "#0B71FE", borderRadius: "0 4px 4px 0" }} />
                        )}
                        <MapIcon size={iconSize} strokeWidth={(pathname.startsWith("/academia") || pathname.startsWith("/courses")) ? 2.5 : 2} />
                        <span className="nav-item-label">Academia</span>
                    </button>
                )}

                {/* ── COMUNIDAD ── */}
                {isStudentOrGuest && (
                    <button
                        onClick={() => navigateTo("/comunidad")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 16px",
                            background: isCompactSidebar ? "transparent" : (pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings") ? "rgba(11, 113, 254, 0.12)" : "transparent"),
                            border: "none",
                            borderRadius: 10,
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            fontSize: 14,
                            fontWeight: (pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings")) ? 700 : 500,
                            textAlign: "left",
                            color: (pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings")) ? "#0B71FE" : "#64748B",
                            ...compactButtonOverrides(pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings")),
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: (pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings")) ? "0 4px 12px rgba(11, 113, 254, 0.12)" : "none"
                        }}
                        onMouseEnter={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = (pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings")) ? "rgba(11, 113, 254, 0.18)" : "#F1F5F9"
                                e.currentTarget.style.color = "#0B71FE"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = (pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings")) ? "rgba(11, 113, 254, 0.12)" : "transparent"
                                e.currentTarget.style.color = (pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings")) ? "#0B71FE" : "#64748B"
                            }
                        }}
                    >
                        {(pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings")) && (
                            <div style={{ position: "absolute", left: 0, top: "15%", height: "70%", width: "4px", backgroundColor: "#0B71FE", borderRadius: "0 4px 4px 0" }} />
                        )}
                        <MessageSquare size={iconSize} strokeWidth={(pathname.startsWith("/comunidad") || pathname.startsWith("/forum") || pathname.startsWith("/rankings")) ? 2.5 : 2} />
                        <span className="nav-item-label">Comunidad</span>
                    </button>
                )}

                {/* ── TIENDA ── */}
                {isStudentOrGuest && (
                    <button
                        onClick={() => navigateTo("/tienda")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 16px",
                            background: isCompactSidebar ? "transparent" : (tiendaActive ? "rgba(245, 158, 11, 0.12)" : "transparent"),
                            border: "none",
                            borderRadius: 10,
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            fontSize: 14,
                            fontWeight: tiendaActive ? 700 : 500,
                            textAlign: "left",
                            color: tiendaActive ? "#d97706" : "#64748B",
                            ...compactButtonOverrides(tiendaActive),
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: tiendaActive ? "0 4px 12px rgba(245, 158, 11, 0.12)" : "none"
                        }}
                        onMouseEnter={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = tiendaActive ? "rgba(245, 158, 11, 0.18)" : "#F1F5F9"
                                e.currentTarget.style.color = "#d97706"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = tiendaActive ? "rgba(245, 158, 11, 0.12)" : "transparent"
                                e.currentTarget.style.color = tiendaActive ? "#d97706" : "#64748B"
                            }
                        }}
                    >
                        {tiendaActive && (
                            <div style={{ position: "absolute", left: 0, top: "15%", height: "70%", width: "4px", backgroundColor: "#d97706", borderRadius: "0 4px 4px 0" }} />
                        )}
                        <ShoppingBag size={iconSize} strokeWidth={tiendaActive ? 2.5 : 2} />
                        <span className="nav-item-label">Tienda</span>
                    </button>
                )}

                {/* ── BIZEN LIVE ── */}
                {user && (
                    <button
                        onClick={() => navigateTo(isAdminOrTeacher ? "/live/host" : "/live/join")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 16px",
                            background: isCompactSidebar ? "transparent" : (liveActive ? "rgba(251, 191, 36, 0.12)" : "transparent"),
                            border: "none",
                            borderRadius: 10,
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            fontSize: 14,
                            fontWeight: liveActive ? 700 : 500,
                            textAlign: "left",
                            color: liveActive ? "#fbbf24" : "#64748B",
                            ...compactButtonOverrides(liveActive),
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: liveActive ? "0 4px 12px rgba(251, 191, 36, 0.12)" : "none"
                        }}
                        onMouseEnter={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = liveActive ? "rgba(251, 191, 36, 0.18)" : "#F1F5F9"
                                e.currentTarget.style.color = "#fbbf24"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = liveActive ? "rgba(251, 191, 36, 0.12)" : "transparent"
                                e.currentTarget.style.color = liveActive ? "#fbbf24" : "#64748B"
                            }
                        }}
                    >
                        {liveActive && (
                            <div style={{ position: "absolute", left: 0, top: "15%", height: "70%", width: "4px", backgroundColor: "#fbbf24", borderRadius: "0 4px 4px 0" }} />
                        )}
                        <Zap size={iconSize} strokeWidth={liveActive ? 2.5 : 2} fill={liveActive ? "#fbbf24" : "none"} />
                        <span className="nav-item-label">{isAdminOrTeacher ? "Lanzar Live Quiz" : "Bizen Live"}</span>
                    </button>
                )}

                {/* ── FUNCIONES DE ADMINISTRADOR / MAESTRO ── */}
                {isAdminOrTeacher && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                        <button
                            onClick={() => navigateTo("/teacher/dashboard")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px",
                                background: isCompactSidebar ? "transparent" : (pathname === "/teacher/dashboard" ? "#eff6ff" : "transparent"),
                                border: "none",
                                borderRadius: 10,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                fontSize: 14,
                                fontWeight: pathname === "/teacher/dashboard" ? 700 : 600,
                                textAlign: "left",
                                color: pathname === "/teacher/dashboard" ? "#0B71FE" : "#4b5563",
                                ...compactButtonOverrides(pathname === "/teacher/dashboard")
                            }}
                            onMouseEnter={(e) => {
                                if (!isCompactSidebar) {
                                    e.currentTarget.style.background = "#f8fafc"
                                    e.currentTarget.style.color = "#0B71FE"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isCompactSidebar) {
                                    e.currentTarget.style.background = pathname === "/teacher/dashboard" ? "#eff6ff" : "transparent"
                                    e.currentTarget.style.color = pathname === "/teacher/dashboard" ? "#0B71FE" : "#4b5563"
                                }
                            }}
                        >
                            <BarChart2 size={iconSize} strokeWidth={pathname === "/teacher/dashboard" ? 2.5 : 2} />
                            <span className="nav-item-label">Panel escolar</span>
                        </button>

                        <button
                            onClick={() => navigateTo("/teacher/courses")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px",
                                background: isCompactSidebar ? "transparent" : (pathname === "/teacher/courses" ? "#eff6ff" : "transparent"),
                                border: "none",
                                borderRadius: 10,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                fontSize: 14,
                                fontWeight: pathname === "/teacher/courses" ? 700 : 600,
                                textAlign: "left",
                                color: pathname === "/teacher/courses" ? "#0B71FE" : "#4b5563",
                                ...compactButtonOverrides(pathname === "/teacher/courses")
                            }}
                            onMouseEnter={(e) => {
                                if (!isCompactSidebar) {
                                    e.currentTarget.style.background = "#f8fafc"
                                    e.currentTarget.style.color = "#0B71FE"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isCompactSidebar) {
                                    e.currentTarget.style.background = pathname === "/teacher/courses" ? "#eff6ff" : "transparent"
                                    e.currentTarget.style.color = pathname === "/teacher/courses" ? "#0B71FE" : "#4b5563"
                                }
                            }}
                        >
                            <MapIcon size={iconSize} strokeWidth={pathname === "/teacher/courses" ? 2.5 : 2} />
                            <span className="nav-item-label">Cursos escuela</span>
                        </button>
                    </div>
                )}

                {/* ── CONFIGURACIÓN ── */}
                {user && (
                    <button
                        onClick={() => navigateTo("/configuracion")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "14px 16px",
                            background: isCompactSidebar ? "transparent" : (settingsActive ? "rgba(11, 113, 254, 0.12)" : "transparent"),
                            border: "none",
                            borderRadius: 10,
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            fontSize: 14,
                            fontWeight: settingsActive ? 700 : 500,
                            textAlign: "left",
                            color: settingsActive ? "#0B71FE" : "#64748B",
                            marginTop: "auto",
                            ...compactButtonOverrides(settingsActive),
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: settingsActive ? "0 4px 12px rgba(11, 113, 254, 0.12)" : "none"
                        }}
                        onMouseEnter={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = settingsActive ? "rgba(11, 113, 254, 0.18)" : "#F1F5F9"
                                e.currentTarget.style.color = "#0B71FE"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isCompactSidebar) {
                                e.currentTarget.style.background = settingsActive ? "rgba(11, 113, 254, 0.12)" : "transparent"
                                e.currentTarget.style.color = settingsActive ? "#0B71FE" : "#64748B"
                            }
                        }}
                    >
                        {settingsActive && (
                            <div style={{ position: "absolute", left: 0, top: "15%", height: "70%", width: "4px", backgroundColor: "#0B71FE", borderRadius: "0 4px 4px 0" }} />
                        )}
                        <Settings size={iconSize} strokeWidth={settingsActive ? 2.5 : 2} />
                        <span className="nav-item-label">Configuración</span>
                    </button>
                )}
              </div>
            </div>
          )}

          `;

const newData = data.substring(0, startIndex) + replacement + data.substring(endIndex);
fs.writeFileSync(file, newData, 'utf8');
console.log("Replaced successfully!");
