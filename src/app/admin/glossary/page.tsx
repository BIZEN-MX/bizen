"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Save, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Search
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import ReturnButton from "@/components/ReturnButton"

const SUPER_ADMINS = ["diego@bizen.mx"]

interface Term {
  word: string;
  definition: string;
}

export default function AdminGlossaryPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'ok' | 'err', text: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchWord, setSearchWord] = useState("")
  
  // Glossary State
  const [terms, setTerms] = useState<Term[]>([])

  const isAllowed = isLoaded && user?.emailAddresses[0]?.emailAddress && SUPER_ADMINS.includes(user.emailAddresses[0].emailAddress.toLowerCase())

  useEffect(() => {
    if (isLoaded && !isAllowed) {
      router.push("/dashboard")
    }
  }, [isLoaded, isAllowed, router])

  useEffect(() => {
    if (isAllowed) fetchGlossary()
  }, [isAllowed])

  const fetchGlossary = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/glossary`)
      const data = await res.json()
      if (res.ok && data.terms) {
        setTerms(data.terms)
      }
    } catch (error) {
      console.error("Error fetching glossary:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTerm = () => {
    setTerms([{ word: "", definition: "" }, ...terms])
  }

  const handleUpdateTerm = (index: number, key: keyof Term, value: string) => {
    const newTerms = [...terms]
    newTerms[index][key] = value
    setTerms(newTerms)
  }

  const handleRemoveTerm = (index: number) => {
    if (!confirm("¿Eliminar este término del glosario global?")) return;
    const newTerms = [...terms]
    newTerms.splice(index, 1)
    setTerms(newTerms)
  }

  const handleSubmit = async () => {
    // Validar que no haya vacios
    const validTerms = terms.filter(t => t.word.trim() !== "" && t.definition.trim() !== "")
    
    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/admin/glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terms: validTerms })
      })
      if (res.ok) {
        setMessage({ type: 'ok', text: "Glosario global sincronizado en vivo" })
        setTerms(validTerms) // limpiar los vacíos de la UI
        setTimeout(() => setMessage(null), 3000)
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

  const filteredTerms = terms.filter(t => t.word.toLowerCase().includes(searchWord.toLowerCase()) || t.definition.toLowerCase().includes(searchWord.toLowerCase()))

  if (!isLoaded || !isAllowed) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 md:p-12 font-sans selection:bg-pink-500/30">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-pink-500/10 p-2 rounded-lg border border-pink-500/20">
                <BookOpen className="w-6 h-6 text-pink-400" />
              </div>
              <span className="text-pink-400 font-bold tracking-widest text-xs uppercase">Bizen Super Admin</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">Glosario Dinámico</h1>
            <p className="text-slate-400 text-lg">Define términos financieros y reglas que sobrescribirán los conceptos en todas las lecciones automáticamente.</p>
          </div>
          <ReturnButton href="/teacher/dashboard" label="Volver al Dashboard" />
        </header>

        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-3 p-4 mb-8 rounded-2xl border ${
                message.type === 'ok' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'ok' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-bold">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b1120] border border-white/5 rounded-3xl p-6 shadow-2xl">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar concepto..."
                className="w-full bg-[#161d2f] border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-medium"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleAddTerm}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all"
              >
                <Plus className="w-4 h-4" />
                Agregar Término
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting || loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Glosario
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="py-24 text-center bg-[#0b1120] border border-white/5 rounded-3xl shadow-xl">
                <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-4" />
                <p className="text-slate-500 font-bold">Cargando glosario en vivo...</p>
              </div>
            ) : filteredTerms.length === 0 ? (
              <div className="py-24 text-center bg-[#0b1120] border border-white/5 rounded-3xl shadow-xl">
                <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 font-bold mb-4">Aún no hay términos financieros creados.</p>
                <button 
                  onClick={handleAddTerm}
                  className="bg-pink-600 hover:bg-pink-500 px-6 py-2 rounded-xl text-sm font-bold transition-all"
                >
                  Da el primer paso
                </button>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredTerms.map((term, i) => {
                    // Encontrar índice real en el array principal para no sobreescribir mal al filtrar
                    const origIndex = terms.indexOf(term);
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={origIndex}
                        className="bg-[#111827] border border-white/10 hover:border-pink-500/50 rounded-2xl p-5 shadow-xl group transition-colors relative"
                      >
                        <button 
                          onClick={() => handleRemoveTerm(origIndex)}
                          className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col gap-3">
                          <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Concepto</span>
                            <input
                              type="text"
                              value={term.word}
                              onChange={(e) => handleUpdateTerm(origIndex, "word", e.target.value)}
                              placeholder="Ej: ETF"
                              className="bg-transparent border-b border-white/10 hover:border-pink-500/30 focus:border-pink-500 pb-2 text-white font-black text-xl focus:outline-none transition-colors w-full"
                            />
                          </label>
                          <label className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Definición BIZEN</span>
                            <textarea
                              value={term.definition}
                              onChange={(e) => handleUpdateTerm(origIndex, "definition", e.target.value)}
                              placeholder="Fondo de Inversión Cotizado..."
                              className="bg-black/20 border border-white/5 rounded-xl p-3 text-slate-300 focus:outline-none focus:ring-1 focus:ring-pink-500/50 resize-none h-28 text-sm"
                            />
                          </label>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        <footer className="mt-12 mb-8 text-center text-slate-500 text-sm">
          <p>© 2026 BIZEN Financial Education — Panel de Contenido Educativo Activo</p>
        </footer>

      </div>
    </div>
  )
}
