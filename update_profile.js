const fs = require('fs');

function refactorFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // get dbProfile from useAuth
  if (!content.includes('const { user, loading, refreshUser, dbProfile } = useAuth()')) {
    content = content.replace(
      'const { user, loading, refreshUser } = useAuth()',
      'const { user, loading, refreshUser, dbProfile } = useAuth()'
    );
  }

  // Define isAdminOrTeacher and isStudentOrGuest
  if (!content.includes('const isStudentOrGuest = !isAdminOrTeacher')) {
    content = content.replace(
      'const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)',
      `const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const isAdminOrTeacher = dbProfile?.role === "school_admin" || dbProfile?.role === "teacher"
  const isStudentOrGuest = !isAdminOrTeacher`
    );
  }

  // Wrap level & progress section
  const targetStr1 = '{userStats && !loadingStats && (';
  const replaceStr1 = '{userStats && !loadingStats && isStudentOrGuest && (';
  content = content.replace(targetStr1, replaceStr1);

  // Wrap Replay Onboarding Tour
  const targetStr2 = '{/* Replay Onboarding Tour */}';
  const replaceStr2 = '{isStudentOrGuest && (\n            <>\n            {/* Replay Onboarding Tour */}';
  content = content.replace(targetStr2, replaceStr2);

  const targetStr3 = '</button>\n            </div>';
  const replaceStr3 = '</button>\n            </div>\n            </>\n            )}';
  content = content.replace(targetStr3, replaceStr3);

  fs.writeFileSync(filePath, content, 'utf8');
}

refactorFile('src/app/profile/page.tsx');
console.log('Done profile');
