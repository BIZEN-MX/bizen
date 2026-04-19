const fs = require('fs');

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add isAdminOrTeacher etc.
  if (!content.includes('isAdminOrTeacher')) {
    content = content.replace(
      'const iconSize = 24',
      `const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
  const isStudentOrGuest = !isAdminOrTeacher
  const iconSize = 24`
    );
  }

  // Wrap student-only parts
  // Find <button data-bizen-tour-menu-item="courses"
  // up to just before {mounted && user && (
  const studentTopPartStart = content.indexOf('<button\n                data-bizen-tour-menu-item="courses"');
  if (studentTopPartStart !== -1) {
      const studentTopPartEnd = content.indexOf('{mounted && user && (', studentTopPartStart);
      
      if (!content.substring(studentTopPartStart - 50, studentTopPartStart).includes('isStudentOrGuest')) {
        const topSlice = content.substring(studentTopPartStart, studentTopPartEnd);
        content = content.substring(0, studentTopPartStart) + 
                  '{isStudentOrGuest && (\n<>\n' + 
                  topSlice + 
                  '</>\n)}\n              ' +
                  content.substring(studentTopPartEnd);
      }
  }

  // Inside mounted && user block: wrap foro
  const foroStart = content.indexOf('<button\n                    data-bizen-tour-menu-item="foro"');
  if (foroStart !== -1) {
    // Find the end of foro button which is </button>
    const foroEndStr = 'Foro</span>\n                  </button>';
    const foroEnd = content.indexOf(foroEndStr, foroStart) + foroEndStr.length;
    
    if (!content.substring(foroStart - 50, foroStart).includes('isStudentOrGuest')) {
      const foroSlice = content.substring(foroStart, foroEnd);
      content = content.substring(0, foroStart) +
                '{isStudentOrGuest && (\n' + foroSlice + '\n)}\n' +
                content.substring(foroEnd);
    }
  }

  // Admin panel replacing existing check
  const adminCheckStr = "{(dbProfile?.role === 'teacher' || dbProfile?.role === 'school_admin') && (";
  if (content.includes(adminCheckStr)) {
    const adminPanelEndStr = 'Panel escolar</span>\n                    </button>\n                  )}';
    const repStart = content.indexOf(adminCheckStr);
    const repEnd = content.indexOf(adminPanelEndStr, repStart) + adminPanelEndStr.length;
    
    const replacement = `{isAdminOrTeacher && (
                    <>
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
                        fontFamily: "'Montserrat', sans-serif",
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
                          e.currentTarget.style.transform = "translateX(-4px)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCompactSidebar) {
                          e.currentTarget.style.background = pathname === "/teacher/dashboard" ? "#eff6ff" : "transparent"
                          e.currentTarget.style.color = pathname === "/teacher/dashboard" ? "#0B71FE" : "#4b5563"
                          e.currentTarget.style.transform = "translateX(0)"
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
                        fontFamily: "'Montserrat', sans-serif",
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
                          e.currentTarget.style.transform = "translateX(-4px)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCompactSidebar) {
                          e.currentTarget.style.background = pathname === "/teacher/courses" ? "#eff6ff" : "transparent"
                          e.currentTarget.style.color = pathname === "/teacher/courses" ? "#0B71FE" : "#4b5563"
                          e.currentTarget.style.transform = "translateX(0)"
                        }
                      }}
                    >
                      <MapIcon size={iconSize} strokeWidth={pathname === "/teacher/courses" ? 2.5 : 2} />
                      <span className="nav-item-label">Cursos de la escuela</span>
                    </button>
                    </>
                  )}`;
    content = content.substring(0, repStart) + replacement + content.substring(repEnd);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

refactorFile('src/components/FixedSidebar.tsx');
console.log('FixedSidebar.tsx processed.');
