const fs = require('fs');

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // get dbProfile
  if (!content.includes('const { user, dbProfile } = useAuth()')) {
    content = content.replace(
      'const { user } = useAuth()',
      'const { user, dbProfile } = useAuth()'
    );
  }

  // Define isStudentOrGuest
  if (!content.includes('const isStudentOrGuest')) {
    content = content.replace(
      'const currentLang = t[settings.language]',
      `const currentLang = t[settings.language]
  
  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
  const isStudentOrGuest = !isAdminOrTeacher`
    );
  }

  // Filter sections array
  const sectionsTarget = `const sections = [
    { id: "general", name: currentLang.sections.general, icon: "" },
    { id: "account", name: currentLang.sections.account, icon: "" },
    { id: "notifications", name: currentLang.sections.notifications, icon: "" },
    { id: "privacy", name: currentLang.sections.privacy, icon: "" },
    { id: "content", name: currentLang.sections.content, icon: "" },
    { id: "accounts", name: currentLang.sections.accounts, icon: "" },
    { id: "accessibility", name: currentLang.sections.accessibility, icon: "" },
  ]`;
  
  const sectionsReplace = `const sections = [
    { id: "general", name: currentLang.sections.general, icon: "" },
    { id: "account", name: currentLang.sections.account, icon: "" },
    ...(isStudentOrGuest ? [{ id: "notifications", name: currentLang.sections.notifications, icon: "" }] : []),
    ...(isStudentOrGuest ? [{ id: "privacy", name: currentLang.sections.privacy, icon: "" }] : []),
    ...(isStudentOrGuest ? [{ id: "content", name: currentLang.sections.content, icon: "" }] : []),
    ...(isStudentOrGuest ? [{ id: "accounts", name: currentLang.sections.accounts, icon: "" }] : []),
    { id: "accessibility", name: currentLang.sections.accessibility, icon: "" },
  ]`;

  content = content.replace(sectionsTarget, sectionsReplace);

  fs.writeFileSync(filePath, content, 'utf8');
}

refactorFile('src/app/configuracion/page.tsx');
console.log('Done config');
