const { execSync } = require('child_process');
execSync('npx tsc src/app/tienda/page.tsx --noEmit --jsx preserve --esModuleInterop --skipLibCheck --target esnext', {stdio: 'inherit'});
