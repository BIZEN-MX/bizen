import { NextResponse } from "next/server"
import { createSupabaseServer } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

// BIZEN admin emails
const ADMIN_EMAILS = [
  "diego@bizen.mx",
  "202207895@mondragonmexico.edu.mx", // Legacy admin email
]

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Check if user is admin
    if (!ADMIN_EMAILS.includes(user.email || "")) {
      return NextResponse.json({ error: "No autorizado - Solo administradores" }, { status: 403 })
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    console.log(`[DELETE_USER_DATA] Deleting all data for user: ${userId}`)

    // Delete all user data in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete diagnostic quiz
      const diagnosticQuiz = await tx.diagnosticQuiz.deleteMany({
        where: { userId }
      })

      // Delete quiz answers (will cascade from quiz attempts, but delete manually to be sure)
      const quizAnswers = await tx.quizAnswer.deleteMany({
        where: {
          quizAttempt: {
            userId
          }
        }
      })

      // Delete quiz attempts
      const quizAttempts = await tx.quizAttempt.deleteMany({
        where: { userId }
      })

      // Delete page visits
      const pageVisits = await tx.pageVisit.deleteMany({
        where: { userId }
      })

      // Delete section completions
      const sectionCompletions = await tx.sectionCompletion.deleteMany({
        where: { userId }
      })

      // Delete user section completions
      const userSectionCompletions = await tx.userSectionCompletion.deleteMany({
        where: { userId }
      })

      // Delete user module progress
      const userModuleProgress = await tx.userModuleProgress.deleteMany({
        where: { userId }
      })

      // Delete file uploads (with physical file deletion)
      const fileUploads = await tx.fileUpload.findMany({
        where: { userId },
        select: { id: true, path: true }
      })

      let filesDeleted = 0
      const { unlink } = await import('fs/promises')
      const { join } = await import('path')
      const { existsSync } = await import('fs')

      for (const file of fileUploads) {
        const filePath = join(process.cwd(), 'public', file.path)
        if (existsSync(filePath)) {
          try {
            await unlink(filePath)
            filesDeleted++
          } catch (error) {
            console.error('Error deleting physical file:', error)
          }
        }
      }

      const deletedFileUploads = await tx.fileUpload.deleteMany({
        where: { userId }
      })

      return {
        diagnosticQuiz: diagnosticQuiz.count,
        quizAnswers: quizAnswers.count,
        quizAttempts: quizAttempts.count,
        pageVisits: pageVisits.count,
        sectionCompletions: sectionCompletions.count,
        userSectionCompletions: userSectionCompletions.count,
        userModuleProgress: userModuleProgress.count,
        fileUploads: deletedFileUploads.count,
        physicalFilesDeleted: filesDeleted,
      }
    })

    console.log(`[DELETE_USER_DATA] Deleted records:`, result)

    return NextResponse.json({
      success: true,
      message: `All data for user ${userId} has been deleted`,
      deletedRecords: result,
    })
  } catch (error) {
    console.error("Error deleting user data:", error)
    return NextResponse.json(
      { error: "Failed to delete user data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
