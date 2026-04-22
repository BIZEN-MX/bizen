"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { 
  School, 
  Search, 
  Plus, 
  Save, 
  Trash2, 
  Edit3,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Mail,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReturnButton from "@/components/ReturnButton"

const SUPER_ADMINS = ["diego@bizen.mx"]

export default function AdminSchoolsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [schools, setSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'ok' | 'err', text: string } | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchool, setEditingSchool] = useState<any>(null)
  
  // Form State
  const [formName, setFormName] = useState("")
  const [formRegion, setFormRegion] = useState("")
  const [formContact, setFormContact] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAllowed = isLoaded && user?.emailAddresses[0]?.emailAddress && SUPER_ADMINS.includes(user.emailAddresses[0].emailAddress.toLowerCase())

  useEffect(() => {
    if (isLoaded && !isAllowed) {
      router.push("/dashboard")
    }
  }, [isLoaded, isAllowed, router])

  useEffect(() => {
    if (isAllowed) {
      fetchSchools()
    }
  }, [isAllowed])

  const fetchSchools = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/schools`)
      const data = await res.json()
      if (res.ok) {
        setSchools(data.schools)
      }
    } catch (error) {
      console.error("Error fetching schools:", error)
    } finally {
      setLoading(false)
    }
  }

  const openNewModal = () => {
    setEditingSchool(null)
    setFormName("")
    setFormRegion("")
    setFormContact("")
    setIsModalOpen(true)
  }

  const openEditModal = (school: any) => {
    setEditingSchool(school)
    setFormName(school.name || "")
    setFormRegion(school.region || "")
    setFormContact(school.contactEmail || "")
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar a la institución ${name}? Esto podría dejar a sus alumnos sin escuela asignada.`)) return

    setMessage(null)
    try {
      const res = await fetch(`/api/admin/schools?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        setMessage({ type: 'ok', text: "Institución eliminada" })
        fetchSchools()
      } else {
        const data = await res.json()
        setMessage({ type: 'err', text: data.error || "Error al eliminar" })
      }
    } catch (error) {
      setMessage({ type: 'err', text: "Error de conexión" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const payload = {
      id: editingSchool?.id,
      name: formName,
      region: formRegion,
      contactEmail: formContact
    }

    try {
      const res = await fetch("/api/admin/schools", {
        method: editingSchool ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setMessage({ type: 'ok', text: editingSchool ? "Institución actualizada" : "Institución creada correctamente" })
        setIsModalOpen(false)
        fetchSchools()
      } else {
        const data = await res.json()
        setMessage({ type: 'err', text: data.error || "Error al guardar" })
      }
    } catch (error) {
      setMessage({ type: 'err', text: "Error de conexión" })
    } finally {
      setIsSubmitting(false)
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
    <div className="min-h-screen bg-[#02040a] text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <School className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase">Bizen Super Admin</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Gestión de Instituciones</h1>
            <p className="text-slate-400 text-lg">Crea y administra las escuelas asociadas a la plataforma.</p>
          </div>
          <ReturnButton href="/teacher/dashboard" label="Volver al Dashboard" />
        </header>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Actions Bar */}
          <div className="flex justify-between items-center bg-[#0b1120] border border-white/5 rounded-3xl p-6 shadow-2xl shadow-emerald-500/5">
            <h2 className="text-xl font-bold">Listado Activo ({schools.length})</h2>
            <button 
              onClick={openNewModal}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" />
              Nueva Institución
            </button>
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

          {/* Schools Table */}
          <div className="bg-[#0b1120] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Nombre Institución</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Región / Dominio</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Contacto Base</th>
                    <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-24 text-center">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">Cargando instituciones...</p>
                      </td>
                    </tr>
                  ) : schools.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-24 text-center">
                        <School className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold">No hay instituciones creadas</p>
                      </td>
                    </tr>
                  ) : schools.map((s) => (
                    <tr key={s.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-sm">
                            {s.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white mb-0.5">{s.name}</div>
                            <div className="text-slate-500 text-xs font-mono">{s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                          <Globe className="w-4 h-4 text-slate-500" />
                          {s.region || <span className="text-slate-600 italic">No especificada</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-300 font-medium">
                          <Mail className="w-4 h-4 text-slate-500" />
                          {s.contactEmail || <span className="text-slate-600 italic">Sin correo</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors tooltip-trigger"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, s.name)}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors tooltip-trigger"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>© 2026 BIZEN Financial Education — Panel de Administración Institucional</p>
        </footer>

      </div>

      {/* Modal Crear/Editar */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-[#0b1120] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl p-6"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <School className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">{editingSchool ? "Editar Institución" : "Nueva Institución"}</h3>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-slate-400">Nombre Oficial</span>
                  <input
                    required
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Colegio Tecnológico..."
                    className="bg-[#161d2f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </label>
                
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-slate-400">Región / Dominio Web (Opcional)</span>
                  <input
                    type="text"
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value)}
                    placeholder="CDMX o @escuela.edu"
                    className="bg-[#161d2f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-slate-400">Correo Principal (Opcional)</span>
                  <input
                    type="email"
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="contacto@escuela.edu"
                    className="bg-[#161d2f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSubmitting ? "Guardando..." : "Guardar Institución"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
