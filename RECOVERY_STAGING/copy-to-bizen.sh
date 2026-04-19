#!/bin/bash

# Script to copy shared components and utilities to a new BIZEN project
# Usage: ./copy-to-bizen.sh /path/to/your/new/bizen/project

if [ -z "$1" ]; then
    echo "Usage: ./copy-to-bizen.sh /path/to/your/new/bizen/project"
    exit 1
fi

BIZEN_PROJECT="$1"
SOURCE_DIR="/Users/diegopenasanchez/bsmx"

if [ ! -d "$BIZEN_PROJECT" ]; then
    echo "Error: Directory $BIZEN_PROJECT does not exist"
    exit 1
fi

echo "📦 Copying shared components and utilities to $BIZEN_PROJECT..."

# Create directories
mkdir -p "$BIZEN_PROJECT/src/components"
mkdir -p "$BIZEN_PROJECT/src/lib/supabase"
mkdir -p "$BIZEN_PROJECT/src/lib/emails"

# Copy shared UI components
echo "📁 Copying UI components..."
cp "$SOURCE_DIR/src/components/BillyCelebration.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/BillyChatbot.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/BillyCourseAssistant.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/BillyFinalTestIntro.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/BillyWelcomeScreen.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/AccordionItem.client.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/ContactForm.client.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/CourseCompletionCelebration.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/DiagnosticQuiz.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/DiagnosticQuizIntro.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/FinalTestQuiz.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/FreeAIChatbot.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/GlobalButtonSounds.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/Header.client.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/MarkCompleteButton.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/ModuleGate.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/ModuleSectionsGated.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/NavigationLoading.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/PageTracker.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/PasswordStrengthField.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/ProtectedRoute.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/QuizTracker.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/ScrollToTop.client.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/SectionGate.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/SectionLayout.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/TalkingCharacter.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null
cp "$SOURCE_DIR/src/components/WorkbookDownloadPage.tsx" "$BIZEN_PROJECT/src/components/" 2>/dev/null

# Copy BIZEN-specific components
echo "📁 Copying BIZEN-specific components..."
cp -r "$SOURCE_DIR/src/components/bizen" "$BIZEN_PROJECT/src/components/" 2>/dev/null

# Copy shared utilities
echo "📁 Copying utility libraries..."
cp "$SOURCE_DIR/src/lib/emailValidation.ts" "$BIZEN_PROJECT/src/lib/" 2>/dev/null
cp "$SOURCE_DIR/src/lib/prisma.ts" "$BIZEN_PROJECT/src/lib/" 2>/dev/null
cp "$SOURCE_DIR/src/lib/resend.ts" "$BIZEN_PROJECT/src/lib/" 2>/dev/null
cp "$SOURCE_DIR/src/lib/validator.ts" "$BIZEN_PROJECT/src/lib/" 2>/dev/null

# Copy email templates
echo "📁 Copying email templates..."
cp -r "$SOURCE_DIR/src/lib/emails"/* "$BIZEN_PROJECT/src/lib/emails/" 2>/dev/null

# Copy Supabase clients (use BIZEN versions as base)
echo "📁 Copying Supabase clients..."
cp "$SOURCE_DIR/src/lib/supabase/client-bizen.ts" "$BIZEN_PROJECT/src/lib/supabase/client.ts" 2>/dev/null
cp "$SOURCE_DIR/src/lib/supabase/server-bizen.ts" "$BIZEN_PROJECT/src/lib/supabase/server.ts" 2>/dev/null

echo ""
echo "✅ Copy complete!"
echo ""
echo "⚠️  IMPORTANT: You need to modify these files after copying:"
echo ""
echo "1. src/lib/supabase/client.ts"
echo "   - Change NEXT_PUBLIC_SUPABASE_URL_BIZEN to NEXT_PUBLIC_SUPABASE_URL"
echo "   - Change NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN to NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "2. src/lib/supabase/server.ts"
echo "   - Change NEXT_PUBLIC_SUPABASE_URL_BIZEN to NEXT_PUBLIC_SUPABASE_URL"
echo "   - Change NEXT_PUBLIC_SUPABASE_ANON_KEY_BIZEN to NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "3. Check all imports in components to match your new project structure"
echo ""

