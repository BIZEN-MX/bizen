import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server"

// Lista de correos con poder total
const SUPER_ADMINS = ["diego@bizen.mx"]

async function isSuperAdmin() {
  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress.toLowerCase()
  return email && SUPER_ADMINS.includes(email)
}

export async function GET(request: NextRequest) {
  if (!await isSuperAdmin()) {
    return NextResponse.json({ error: "No tienes permisos de Super Admin" }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const emailSearch = searchParams.get("email")?.trim()

    const client = await clerkClient()
    
    let clerkUsers: any[] = []
    let profiles: any[] = []

    const roleMap: Record<string, string[]> = {
       "admin": ["admin", "school_admin"],
       "super admin": ["admin"],
       "student": ["student", "particular"],
       "estudiante": ["student", "particular"],
       "teacher": ["teacher"],
       "profesor": ["teacher"],
       "maestro": ["teacher"],
       "school_admin": ["school_admin"]
    }

    const searchTermToLower = emailSearch?.toLowerCase() || ""
    const matchedRoles = roleMap[searchTermToLower]

    if (matchedRoles) {
      // Buscar primero en la base de datos por el rol específico
      profiles = await prisma.profile.findMany({
        where: { role: { in: matchedRoles } },
        take: 50
      })

      if (profiles.length > 0) {
        const userIdsToFetch = profiles.map(p => p.userId)
        // Pedirle a Clerk que nos regrese solo esos usuarios
        const clerkRes = await client.users.getUserList({ userId: userIdsToFetch, limit: 50 })
        clerkUsers = Array.isArray(clerkRes) ? clerkRes : (clerkRes as any).data || []
      }
    } else {
      // Búsqueda típica por email o nombre
      // Usamos query para que sea lo más flexible posible (busca en email, nombre, etc)
      const searchParamsConfig: any = { limit: 50 }
      if (emailSearch) {
        searchParamsConfig.query = emailSearch
      }

      const clerkRes = await client.users.getUserList(searchParamsConfig)
      clerkUsers = Array.isArray(clerkRes) ? clerkRes : (clerkRes as any).data || []

      if (clerkUsers.length > 0) {
        const userIds = clerkUsers.map(u => u.id)
        profiles = await prisma.profile.findMany({
          where: { userId: { in: userIds } }
        })
      }
    }
    
    const profileMap = new Map(profiles.map(p => [p.userId, p]))

    const users = clerkUsers.map(cu => {
      const p = profileMap.get(cu.id)
      return {
        userId: cu.id,
        email: cu.emailAddresses?.[0]?.emailAddress || "Sin email",
        fullName: p?.fullName || `${cu.firstName || ''} ${cu.lastName || ''}`.trim() || 'Sin nombre',
        role: p?.role || 'student',
        schoolId: p?.schoolId || null
      }
    })

    const schools = await prisma.school.findMany({
      select: { id: true, name: true }
    })

    return NextResponse.json({ 
      users, 
      schools
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  if (!await isSuperAdmin()) {
    return NextResponse.json({ error: "No tienes permisos de Super Admin" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { userId, role, schoolId } = body

    if (!userId || !role) {
      return NextResponse.json({ error: "ID de usuario y rol son requeridos" }, { status: 400 })
    }

    // Usar upsert por si el perfil no existe todavía en Prisma
    const updatedUser = await prisma.profile.upsert({
      where: { userId },
      update: { 
        role,
        schoolId: schoolId || null
      },
      create: {
        userId,
        role,
        schoolId: schoolId || null,
        fullName: "Usuario Nuevo", // Se actualizará la próxima vez que entre
        xp: 0,
        bizcoins: 0,
        level: 1
      }
    })

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
