"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { 
  Users, 
  ShieldCheck, 
  Search, 
  School, 
  Save, 
  Mail, 
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReturnButton from "@/components/ReturnButton"

const SUPER_ADMINS = ["diego@bizen.mx"]

export default function AdminManagementPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [emailSearch, setEmailSearch] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'ok' | 'err', text: string } | null>(null)
 
  const isAllowed = isLoaded && user?.emailAddresses[0]?.emailAddress && SUPER_ADMINS.includes(user.emailAddresses[0].emailAddress.toLowerCase())
 
  useEffect(() => {
    if (isLoaded && !isAllowed) {
      router.push("/dashboard")
    }
  }, [isLoaded, isAllowed, router])
 
  useEffect(() => {
    if (isAllowed) {
      fetchUsers()
    }
  }, [isAllowed])
 
  const fetchUsers = async (search = "") => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users${search ? `?email=${search}` : ""}`)
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users)
        setSchools(data.schools)
        setDebugInfo(data.debug)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string, schoolId: string | null) => {
    setUpdatingId(userId)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole, schoolId })
      })
      if (res.ok) {
        setMessage({ type: 'ok', text: "Usuario actualizado correctamente" })
        fetchUsers(emailSearch)
      } else {
        const data = await res.json()
        setMessage({ type: 'err', text: data.error || "Error al actualizar" })
      }
    } catch (error) {
      setMessage({ type: 'err', text: "Error de conexión" })
    } finally {
      setUpdatingId(null)
    }
  }

  if (!isLoaded || !isAllowed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">Bizen Super Admin</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Gestión de Acceso</h1>
            <p className="text-slate-400 text-lg">Asigna roles de Administrador o Profesor a cualquier usuario de la plataforma.</p>
          </div>
          <ReturnButton href="/teacher/dashboard" label="Volver al Dashboard" />
        </header>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Search & Actions */}
          <div className="bg-[#0b1120] border border-white/5 rounded-3xl p-6 shadow-2xl shadow-blue-500/5">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar por correo electrónico..."
                className="w-full bg-[#050914] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers(emailSearch)}
              />
              <button 
                onClick={() => fetchUsers(emailSearch)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl text-sm font-bold transition-all"
              >
                Buscar
              </button>
            </div>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex items-center gap-3 p-4 rounded-2xl border ${
                  message.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}
              >
                {message.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span className="font-bold">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Users Table */}
          <div className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Usuario / Email</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Rol Actual</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Institución</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-24 text-center">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">Cargando usuarios...</p>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-24 text-center">
                        <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">No se encontraron usuarios</p>
                      </td>
                    </tr>
                  ) : users.map((u) => (
                    <UserRow 
                      key={u.userId} 
                      user={u} 
                      schools={schools} 
                      onUpdate={handleUpdateRole} 
                      isUpdating={updatingId === u.userId}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>© 2026 BIZEN Financial Education — Panel de Administración de Identidad</p>
          {debugInfo && (
            <div className="mt-8 p-4 bg-black/40 border border-white/5 rounded-2xl text-left font-mono text-[10px] overflow-auto max-h-40">
              <div className="text-blue-400 font-bold mb-2 uppercase">Debug Information:</div>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </footer>

      </div>
    </div>
  )
}

function UserRow({ user, schools, onUpdate, isUpdating }: { user: any, schools: any[], onUpdate: any, isUpdating: boolean }) {
  const [selectedRole, setSelectedRole] = useState(user.role)
  const [selectedSchool, setSelectedSchool] = useState(user.schoolId || "")

  const hasChanges = selectedRole !== user.role || (selectedSchool || null) !== (user.schoolId || null)

  return (
    <tr className="group hover:bg-white/[0.02] transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-sm">
            {user.fullName?.[0] || user.email?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <div className="font-bold text-white mb-0.5">{user.fullName || "Sin nombre"}</div>
            <div className="text-slate-500 text-sm flex items-center gap-1.5 font-medium">
              <Mail className="w-3 h-3" /> {user.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <select 
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-[#161d2f] border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="student">Estudiante</option>
          <option value="teacher">Profesor</option>
          <option value="school_admin">Admin Escuela</option>
          <option value="admin">Admin Bizen</option>
        </select>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <School className={`w-4 h-4 ${user.schoolId ? 'text-emerald-400' : 'text-slate-600'}`} />
          <select 
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="bg-[#161d2f] border border-white/10 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[200px]"
          >
            <option value="">Ninguna</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </td>
      <td className="px-6 py-5 text-right">
        <button
          onClick={() => onUpdate(user.userId, selectedRole, selectedSchool)}
          disabled={!hasChanges || isUpdating}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${
            hasChanges 
              ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-500/10' 
              : 'bg-white/5 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isUpdating ? 'Guardando...' : 'Guardar'}
        </button>
      </td>
    </tr>
  )
}
