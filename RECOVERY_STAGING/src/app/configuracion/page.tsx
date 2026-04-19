"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { useSettings } from "@/contexts/SettingsContext"
import { useAuth } from "@/contexts/AuthContext"
import { createClientMicrocred } from "@/lib/supabase/client-microcred"
import {
  Settings, User, Bell, Shield, Tv,
  Check, X, AlertTriangle, RotateCcw, ChevronRight,
  Eye, Award, Lock, LogOut, Save, Globe,
  Zap, Contrast, FileText, Sparkles, Medal,
  Phone, Calendar, School, Instagram, ChevronDown, ArrowLeft
} from "lucide-react"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import BizenVirtualCard, { CardTheme } from "@/components/BizenVirtualCard"

export const dynamic = 'force-dynamic'

// ─── Sub-components ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center w-11 h-[26px] rounded-full shrink-0 transition-colors duration-200 outline-none ${checked ? "bg-gradient-to-br from-blue-700 to-blue-500 shadow-[0_0_12px_rgba(15,98,254,0.4)]" : "bg-white/10"}`}
    >
      <span className={`absolute w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${checked ? "left-[21px]" : "left-[3px]"}`} />
    </button>
  )
}

function FieldRow({ label, desc, children }: { label:string;desc?:string;children:React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/10 gap-4">
      <div className="flex-1">
        <div className="text-base font-medium text-white">{label}</div>
        {desc && <div className="text-sm text-white/40 mt-[3px]">{desc}</div>}
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label,desc,checked,onChange }:{label:string;desc?:string;checked:boolean;onChange:(v:boolean)=>void}) {
  return <FieldRow label={label} desc={desc}><Toggle checked={checked} onChange={onChange} /></FieldRow>
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)] mb-4 overflow-hidden backdrop-blur-md">
      <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(15,98,254,0.35)]">
          {icon}
        </div>
        <span className="text-lg font-semibold text-white">{title}</span>
      </div>
      <div className="px-6 pb-1">{children}</div>
    </div>
  )
}

function FieldLabel({ children }:{children:React.ReactNode}) {
  return (
    <div className="text-xs font-semibold text-white/40 tracking-widest uppercase mb-2">
      {children}
    </div>
  )
}

function StyledInput({ value,onChange,placeholder,type="text",disabled }:{value:string;onChange:(v:string)=>void;placeholder?:string;type?:string;disabled?:boolean}) {
  return (
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      className={`w-full px-4 py-3 text-base rounded-xl border border-white/10 outline-none transition-all duration-200 focus:bg-blue-600/5 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.15)] ${disabled ? 'text-white/40 bg-white/5' : 'text-white bg-white/5'}`}
    />
  )
}

function SaveBtn({ onClick,loading,label="Guardar cambios" }:{onClick:()=>void;loading?:boolean;label?:string}) {
  return (
    <button onClick={onClick} disabled={loading}
      className="inline-flex mt-5 items-center justify-center gap-2 px-7 py-3 bg-gradient-to-br from-blue-700 to-blue-500 border-none rounded-xl text-white text-base font-semibold transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(15,98,254,0.3)] hover:shadow-[0_8px_24px_rgba(15,98,254,0.5)] hover:-translate-y-px hover:from-blue-800 hover:to-blue-600 disabled:opacity-65 disabled:pointer-events-none disabled:transform-none"
    >
      <Save size={14}/>{loading?"Guardando...":label}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function SettingsContent() {
  const router=useRouter()
  const {user,dbProfile,refreshUser}=useAuth()
  const {settings,updateSettings,resetSettings}=useSettings()
  const [supabase,setSupabase]=useState<ReturnType<typeof createClientMicrocred>|null>(null)
  const [activeSection,setActiveSection]=useState("general")
  const [showResetConfirm,setShowResetConfirm]=useState(false)
  const [showPwFields,setShowPwFields]=useState(false)
  const [pw,setPw]=useState({new:"",confirm:""})
  const [saving,setSaving]=useState(false)
  const [toast,setToast]=useState<{ok:boolean;msg:string}|null>(null)
  const [fullName,setFullName]=useState("")
  const [username,setUsername]=useState("")
  const [bio,setBio]=useState("")
  const [avatar,setAvatar]=useState<any>({type:"character",id:"robot",character:"robot",label:"Robot"})
  const [birthDate,setBirthDate]=useState("")
  const [schoolId,setSchoolId]=useState("")
  const [schools,setSchools]=useState<{id:string;name:string}[]>([])
  const [phone,setPhone]=useState("")
  const [cardTheme,setCardTheme]=useState<CardTheme>("blue")

  useEffect(()=>{setSupabase(createClientMicrocred())},[])
  useEffect(()=>{
    if(user&&dbProfile){
      setPhone(dbProfile.phone||user.user_metadata?.phone||"")
      setFullName(dbProfile.fullName||user.user_metadata?.full_name||"")
      setUsername(dbProfile.username||user.user_metadata?.username||"")
      setBio(dbProfile.bio||user.user_metadata?.bio||"")
      if(dbProfile.birthDate)setBirthDate(new Date(dbProfile.birthDate).toISOString().split("T")[0])
      else setBirthDate(user.user_metadata?.birth_date||"")
      setSchoolId(dbProfile.schoolId||user.user_metadata?.school_id||"")
      setAvatar(dbProfile.avatar||user.user_metadata?.avatar||{type:"character",id:"robot",character:"robot",label:"Robot"})
      setCardTheme((dbProfile.cardTheme as CardTheme)||"blue")
      if(dbProfile.settings&&Object.keys(dbProfile.settings).length>0)updateSettings(dbProfile.settings)
    }
  },[user,dbProfile])
  useEffect(()=>{
    fetch("/api/schools").then(r=>{if(r.ok)return r.json();throw new Error()}).then(setSchools).catch(()=>{})
  },[])
  useEffect(()=>{if(typeof window!=="undefined"&&!user)router.push("/login")},[user,router])
  if(!user)return null

  const isAdmin=dbProfile?.role==="school_admin"||dbProfile?.role==="teacher"
  const flash=(ok:boolean,msg:string)=>{setToast({ok,msg});setTimeout(()=>setToast(null),3500)}
  const doSave=async(fn:()=>Promise<void>)=>{
    if(!supabase)return;setSaving(true)
    try{await fn();flash(true,"Guardado correctamente")}
    catch(e:any){flash(false,e?.message||"Error al guardar")}
    finally{setSaving(false)}
  }
  const syncToDB=async(payload:any)=>{
    const res=await fetch("/api/profiles",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})
    if(!res.ok){const d=await res.json();throw new Error(d.error||"Error al sincronizar")}
    if(refreshUser)await refreshUser()
  }
  const savePw=()=>doSave(async()=>{
    if(!pw.new||pw.new.length<6)throw new Error("La contraseña debe tener al menos 6 caracteres")
    if(pw.new!==pw.confirm)throw new Error("Las contraseñas no coinciden")
    const{error}=await supabase!.auth.updateUser({password:pw.new})
    if(error)throw error
    setPw({new:"",confirm:""});setShowPwFields(false)
  })
  const saveProfile=()=>doSave(async()=>{
    await supabase!.auth.updateUser({data:{full_name:fullName,username,bio,birth_date:birthDate,school_id:schoolId,avatar}})
    await syncToDB({fullName,username,bio,birthDate,schoolId,avatar,settings,cardTheme})
  })
  const savePhone=()=>doSave(async()=>{
    await syncToDB({phone})
    await supabase!.auth.updateUser({data:{phone}})
  })
  const saveGlobalSettings=()=>doSave(async()=>{await syncToDB({settings})})

  const roleLabel=()=>{
    if(dbProfile?.role==="school_admin")return"Admin"
    if(dbProfile?.role==="teacher")return"Docente"
    if(dbProfile?.role==="institucional")return"Institucional"
    if(dbProfile?.role==="premium")return"Premium"
    if(dbProfile?.role==="student")return"Estudiante"
    return"Cuenta Gratuita"
  }

  const navItems=[
    {id:"general",label:"General",icon:<Settings size={15} color="white"/>},
    {id:"profile",label:"Perfil",icon:<User size={15} color="white"/>},
    {id:"account",label:"Cuenta",icon:<Lock size={15} color="white"/>},
    ...(!isAdmin?[{id:"privacy",label:"Privacidad",icon:<Shield size={15} color="white"/>}]:[]),
  ]

  return (
    <div className="min-h-screen bg-[#080f1e] font-sans antialiased text-white">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .section-card { animation: fadeUp 0.3s ease both; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.4; cursor: pointer; filter: invert(1); }
      `}</style>

      <div className="relative w-full">
        {/* ── Hero ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#060c1d] via-[#0a1628] to-[#080f20] border-b border-white/10 px-[clamp(24px,5vw,48px)] py-[clamp(32px,5vw,56px)] pb-[clamp(64px,8vw,88px)]">
          {/* Ambient orbs */}
          <div className="absolute -top-[40%] -right-[5%] w-[500px] h-[500px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(15,98,254,0.18)_0%,transparent_65%)]" />
          <div className="absolute -bottom-[30%] left-[5%] w-[380px] h-[380px] rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(15,98,254,0.1)_0%,transparent_65%)]" />


          <div className="relative z-10 flex items-center justify-between flex-wrap gap-5 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <button 
                  onClick={() => router.back()}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 !text-white hover:bg-white/10 hover:!text-white transition-all duration-200"
                  title="Regresar"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-full px-3.5 py-1.5">
                  <Settings size={12} className="text-blue-500"/>
                  <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">Configuración</span>
                </div>
              </div>
              <h1 className="text-[clamp(24px,4vw,36px)] font-bold text-white mb-2 tracking-tight leading-tight">
                Tu cuenta
              </h1>
              <p className="text-base text-white/50 m-0">
                Gestiona tu perfil, privacidad y preferencias
              </p>
            </div>

            {/* User badge */}
            <div className="inline-flex items-center gap-3.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full pl-2 pr-5 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_20px_rgba(15,98,254,0.5)] border-2 border-white/15">
                <AvatarDisplay avatar={avatar||{type:"character",id:"robot",character:"robot"}} size={34}/>
              </div>
              <div>
                <div className="text-base font-bold text-white leading-snug">{fullName||user.email?.split("@")[0]}</div>
                <div className="text-xs text-white/45 uppercase tracking-widest mt-0.5">{roleLabel()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-6 px-4 md:px-8 xl:px-12 mt-[-20px] md:mt-[-36px] max-w-6xl mx-auto pb-24">
          
          {/* ── Sidebar nav ── */}
          <div className="sticky top-4 h-fit bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)] overflow-hidden">
            <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase px-4 pt-3.5 pb-2.5 border-b border-white/10">
              Secciones
            </div>
            <div className="p-1.5 flex flex-col gap-0.5">
              {navItems.map(s=>{
                const active=activeSection===s.id
                return (
                  <button key={s.id} onClick={()=>setActiveSection(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[15px] transition-all duration-200 outline-none hover:bg-white/5 ${active ? "bg-blue-500/15 text-white font-semibold shadow-[inset_0_0_0_1px_rgba(15,98,254,0.3)]" : "text-white/60 font-normal bg-transparent"}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${active ? "bg-gradient-to-br from-blue-700 to-blue-500 shadow-[0_4px_10px_rgba(15,98,254,0.35)]" : "bg-white/5 border border-white/10"}`}>
                      <div className={active ? "text-white" : "text-white/40"}>{s.icon}</div>
                    </div>
                    {s.label}
                    {active&&<ChevronRight size={12} className="text-blue-500 ml-auto"/>}
                  </button>
                )
              })}
            </div>

            <div className="border-t border-white/10 p-1.5 flex flex-col gap-0.5">
              <a href="https://www.instagram.com/bizen.mx?igsh=ZmJmYmdxZHg1Z2E3" target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[15px] text-white/60 transition-all duration-200 hover:bg-[#e1306c]/10 hover:text-[#e1306c] no-underline group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#e1306c]/30 group-hover:bg-[#e1306c]/10 transition-colors">
                  <Instagram size={13} className="text-white/40 group-hover:text-[#e1306c] transition-colors"/>
                </div>
                Instagram
              </a>
              <button onClick={()=>setShowResetConfirm(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[15px] text-white/60 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 outline-none group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-colors">
                  <RotateCcw size={12} className="text-white/40 group-hover:text-red-500 transition-colors"/>
                </div>
                Restaurar defaults
              </button>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="w-full min-w-0">

            {/* Toast */}
            {toast&&(
              <div className={`mb-4 px-5 py-3.5 rounded-xl flex items-center gap-2.5 text-[15px] font-semibold border backdrop-blur-md animate-[fadeUp_0.25s_ease_both] ${toast.ok ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                {toast.ok?<Check size={15} className="text-emerald-400"/>:<X size={15} className="text-red-400"/>}
                {toast.msg}
              </div>
            )}

            {/* ── GENERAL ── */}
            {activeSection==="general"&&(
              <div className="section-card">
                <SectionCard title="Preferencias del sistema" icon={<Zap size={15} color="white"/>}>
                  <ToggleRow label="Efectos de Sonido" desc="Activar efectos de sonido en la app" checked={settings.soundsEnabled} onChange={v=>updateSettings({soundsEnabled:v})}/>
                  <ToggleRow label="Animaciones" desc="Mostrar animaciones y transiciones suaves" checked={settings.animationsEnabled} onChange={v=>updateSettings({animationsEnabled:v})}/>
                  <div className="pb-1"/>
                </SectionCard>
                <SaveBtn onClick={saveGlobalSettings} loading={saving}/>
              </div>
            )}

            {/* ── PROFILE ── */}
            {activeSection==="profile"&&user&&(
              <div className="section-card">
                {/* Identity preview */}
                <div className="bg-white/5 rounded-2xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)] mb-4 flex items-center gap-4 px-6 py-5.5 backdrop-blur-md bg-gradient-to-br from-blue-500/5 to-transparent">
                  <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center shrink-0 shadow-[0_8px_24px_rgba(15,98,254,0.4)]">
                    <AvatarDisplay avatar={avatar||{type:"character",id:"robot",character:"robot"}} size={44} frame={dbProfile?.inventory?.includes("2")?"vip":dbProfile?.inventory?.includes("1")?"ambassador":null}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[19px] font-bold text-white truncate">{fullName||"(Sin nombre)"}</div>
                    <div className="text-[15px] text-white/60 mt-1 truncate">{username?`@${username.replace("@","")}`:user.email}</div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full px-3.5 py-1.5 shrink-0 hidden sm:flex">
                    <Award size={13} className="text-blue-500"/>
                    <span className="text-xs font-semibold text-blue-500">{roleLabel()}</span>
                  </div>
                </div>

                <SectionCard title="Información personal" icon={<User size={15} color="white"/>}>
                  <div className="py-3.5 grid gap-3.5">
                    <div>
                      <FieldLabel>Nombre completo</FieldLabel>
                      <StyledInput value={fullName} onChange={setFullName} placeholder="Tu nombre completo"/>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <FieldLabel>@Username</FieldLabel>
                        <StyledInput value={username} onChange={setUsername} placeholder="usuario123"/>
                      </div>
                      <div>
                        <FieldLabel>Fecha de nacimiento</FieldLabel>
                        <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-3 text-base rounded-xl border border-white/10 bg-white/5 text-white outline-none transition-all duration-200 focus:bg-blue-600/5 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.15)]"
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Bio</FieldLabel>
                      <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Cuéntale algo a tu comunidad..."
                        className="w-full min-h-[80px] px-4 py-3 text-base rounded-xl border border-white/10 bg-white/5 text-white outline-none transition-all duration-200 focus:bg-blue-600/5 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.15)] resize-y"
                      />
                    </div>
                    {dbProfile?.role!=="particular"&&(
                      <div>
                        <FieldLabel>Mi Escuela</FieldLabel>
                        <div className="relative">
                          <select value={schoolId} onChange={e=>setSchoolId(e.target.value)}
                            className="w-full px-4 py-3 pr-10 text-base rounded-xl border border-white/10 bg-white/5 text-white outline-none transition-all duration-200 focus:bg-blue-600/5 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.15)] appearance-none cursor-pointer"
                          >
                            <option value="">Selecciona tu escuela</option>
                            {schools.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          <ChevronDown size={14} className="text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>

                <SaveBtn onClick={saveProfile} loading={saving} label="Actualizar perfil"/>

                <div className="mt-6 p-5 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl flex items-center gap-4 border border-blue-500/20">
                  <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0 border border-blue-500/25">
                    <Sparkles size={18} className="text-blue-500"/>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-blue-500">Consejo de Billy</div>
                    <div className="text-sm text-blue-100/70 mt-1 leading-relaxed">Tener un nombre de usuario único te ayuda a destacar en los rankings globales. ¡Elige uno que te represente!</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ACCOUNT ── */}
            {activeSection==="account"&&user&&(
              <div className="section-card">
                <SectionCard title="Correo electrónico" icon={<User size={15} color="white"/>}>
                  <div className="flex items-center justify-between py-3.5">
                    <div>
                      <div className="text-base font-semibold text-white">{user.email}</div>
                      <div className="text-sm text-white/40 mt-1">Tu dirección de correo principal</div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
                      <Check size={11}/>Verificado
                    </span>
                  </div>
                </SectionCard>

                <SectionCard title="Teléfono" icon={<Phone size={15} color="white"/>}>
                  <div className="py-3.5">
                    <FieldLabel>Número de contacto</FieldLabel>
                    <div className="flex gap-2.5">
                      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)}
                        placeholder="+52 123 456 7890" 
                        className="flex-1 px-4 py-3 text-base rounded-xl border border-white/10 bg-white/5 text-white outline-none transition-all duration-200 focus:bg-blue-600/5 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.15)]"
                      />
                      <button onClick={savePhone} disabled={saving}
                        className="px-6 bg-gradient-to-br from-blue-700 to-blue-500 border-none rounded-xl text-white text-[15px] font-semibold cursor-pointer transition-colors hover:from-blue-800 hover:to-blue-600 whitespace-nowrap shadow-[0_4px_12px_rgba(15,98,254,0.3)] disabled:opacity-60"
                      >
                        {saving?"...":"Guardar"}
                      </button>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Contraseña" icon={<Lock size={15} color="white"/>}>
                  <div className={`pt-3.5 ${showPwFields ? 'pb-0' : 'pb-3.5'}`}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-white/40 tracking-widest">
                        {showPwFields?"Introduce tu nueva contraseña":"••••••••••••"}
                      </div>
                      <button onClick={()=>{setShowPwFields(!showPwFields);setPw({new:"",confirm:""})}}
                        className={`px-4 py-2 border rounded-[10px] text-sm font-semibold cursor-pointer transition-colors outline-none ${showPwFields ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20" : "bg-white/10 border-white/10 text-white/60 hover:bg-white/20"}`}
                      >
                        {showPwFields?"Cancelar":"Cambiar"}
                      </button>
                    </div>
                    {showPwFields&&(
                      <div className="flex flex-col gap-2.5 mt-3.5 pb-3.5 animate-[fadeUp_0.2s_ease_both]">
                        <input type="password" value={pw.new} onChange={e=>setPw({...pw,new:e.target.value})}
                          placeholder="Nueva contraseña (mín. 6 caracteres)" 
                          className="w-full px-4 py-3 text-base rounded-xl border border-white/10 bg-white/5 text-white outline-none transition-all duration-200 focus:bg-blue-600/5 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.15)]"
                        />
                        <input type="password" value={pw.confirm} onChange={e=>setPw({...pw,confirm:e.target.value})}
                          placeholder="Confirmar contraseña" 
                          className="w-full px-4 py-3 text-base rounded-xl border border-white/10 bg-white/5 text-white outline-none transition-all duration-200 focus:bg-blue-600/5 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.15)]"
                        />
                        <SaveBtn onClick={savePw} loading={saving} label="Actualizar contraseña"/>
                      </div>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Sesión y cuenta" icon={<LogOut size={15} color="white"/>}>
                  <div className="pt-3.5 flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1 mt-1">
                      {[
                        {l:"Cuenta creada",v:new Date(user.created_at||Date.now()).toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"})},
                        {l:"Método de acceso",v:"Email y contraseña"},
                      ].map(({l,v})=>(
                        <div key={l} className="px-4 py-3.5 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-xs text-white/40 uppercase tracking-widest mb-1.5">{l}</div>
                          <div className="text-base font-semibold text-white">{v}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2.5 flex-wrap pb-3.5">
                      <button disabled={saving}
                        onClick={async()=>{if(!supabase)return;setSaving(true);try{await supabase.auth.signOut();router.push("/login")}catch{flash(false,"Error al cerrar sesión")}finally{setSaving(false)}}}
                        className="px-6 py-3 bg-gradient-to-br from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border-none rounded-xl text-white text-[15px] font-semibold cursor-pointer shadow-[0_4px_12px_rgba(239,68,68,0.3)] disabled:opacity-60 transition-all outline-none"
                      >
                        {saving?"Saliendo...":"Cerrar Sesión"}
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}

            {/* ── PRIVACY ── */}
            {activeSection==="privacy"&&(
              <div className="section-card">
                <SectionCard title="Visibilidad" icon={<Shield size={15} color="white"/>}>
                  <div className="py-3.5 flex flex-col gap-3.5">
                    {[{k:"profileVisibility",l:"Visibilidad de Perfil en P2P"}].map(({k,l})=>(
                      <div key={k}>
                        <FieldLabel>{l}</FieldLabel>
                        <div className="relative max-w-[300px]">
                          <select value={(settings.privacy as any)[k]}
                            onChange={e=>updateSettings({privacy:{...settings.privacy,[k]:e.target.value as any}})}
                            className="w-full px-4 py-3 pr-10 text-base rounded-xl border border-white/10 bg-white/5 text-white outline-none transition-all duration-200 focus:bg-blue-600/5 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(15,98,254,0.15)] appearance-none cursor-pointer"
                          >
                            <option value="public">Público (Aparecer en búsquedas)</option>
                            <option value="private">Privado (Modo incógnito)</option>
                          </select>
                          <ChevronDown size={14} className="text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
                <SectionCard title="Interacciones" icon={<Shield size={15} color="white"/>}>
                  <ToggleRow label="Mostrar Progreso" desc="Permitir que otros vean tu balance y nivel"
                    checked={settings.privacy.showProgress}
                    onChange={v=>updateSettings({privacy:{...settings.privacy,showProgress:v}})}
                  />
                  <div className="pb-1"/>
                </SectionCard>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar privacidad"/>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Reset Modal ── */}
      {showResetConfirm&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-6">
          <div className="bg-[#0d1b36] rounded-[20px] p-9 max-w-[380px] w-full shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-red-500/20 animate-[scaleIn_0.25s_ease_both]">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-500"/>
              </div>
            </div>
            <h3 className="m-0 mb-2 text-lg font-bold text-white text-center">¿Restaurar configuración?</h3>
            <p className="m-0 mb-7 text-[15px] text-white/50 leading-relaxed text-center">Esto restablecerá todas tus preferencias a los valores predeterminados.</p>
            <div className="flex gap-2.5">
              <button onClick={()=>setShowResetConfirm(false)}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 text-[15px] font-semibold cursor-pointer hover:bg-white/10 hover:text-white transition-colors"
              >Cancelar</button>
              <button onClick={async()=>{resetSettings();setShowResetConfirm(false);await syncToDB({settings:{}});flash(true,"Configuración restaurada")}}
                className="flex-1 py-3 bg-gradient-to-br from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 border-none rounded-xl text-white text-[15px] font-semibold shadow-[0_4px_12px_rgba(239,68,68,0.3)] cursor-pointer transition-colors"
              >Restaurar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center text-[15px] font-semibold text-blue-600 bg-[#080f1e] min-h-screen">
        <div className="text-center">
          <Settings size={32} className="text-blue-600 mb-3 opacity-60 mx-auto"/>
          <div>Cargando configuración...</div>
        </div>
      </div>
    }>
      <SettingsContent/>
    </Suspense>
  )
}
