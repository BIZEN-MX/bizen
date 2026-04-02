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
  Phone, Calendar, School, Instagram, ChevronDown
} from "lucide-react"
import { AvatarDisplay } from "@/components/AvatarDisplay"
import BizenVirtualCard, { CardTheme } from "@/components/BizenVirtualCard"

export const dynamic = 'force-dynamic'

// ─── Design tokens ────────────────────────────────────────────────────────────
const D = {
  bg:         "#080f1e",
  surface:    "rgba(255,255,255,0.04)",
  surfaceHi:  "rgba(255,255,255,0.07)",
  border:     "rgba(255,255,255,0.08)",
  borderHi:   "rgba(15,98,254,0.5)",
  blue:       "#0F62FE",
  blueLight:  "#1983FD",
  blueDim:    "rgba(15,98,254,0.12)",
  blueDimHi:  "rgba(15,98,254,0.25)",
  text:       "#ffffff",
  textMid:    "rgba(255,255,255,0.6)",
  textMuted:  "rgba(255,255,255,0.35)",
  green:      "#10B981",
  greenDim:   "rgba(16,185,129,0.12)",
  red:        "#EF4444",
  redDim:     "rgba(239,68,68,0.12)",
  amber:      "#F59E0B",
  font:       'Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
  r:          "14px",
  rSm:        "10px",
  rLg:        "20px",
  shadow:     "0 4px 24px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.2)",
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      style={{
        position:"relative",display:"inline-flex",alignItems:"center",
        width:44,height:26,borderRadius:999,border:"none",cursor:"pointer",flexShrink:0,padding:0,
        background: checked ? "linear-gradient(135deg,#0056E7,#1983FD)" : "rgba(255,255,255,0.12)",
        transition:"background .2s",
        boxShadow: checked ? "0 0 12px rgba(15,98,254,0.4)" : "none",
      }}
    >
      <span style={{
        position:"absolute",left:checked ? 21 : 3,
        width:20,height:20,borderRadius:"50%",background:"#fff",
        transition:"left .2s",boxShadow:"0 2px 6px rgba(0,0,0,0.3)"
      }} />
    </button>
  )
}

function FieldRow({ label, desc, children }: { label:string;desc?:string;children:React.ReactNode }) {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0",borderBottom:`1px solid ${D.border}`,gap:16}}>
      <div style={{flex:1}}>
        <div style={{fontSize:14,fontWeight:500,color:D.text}}>{label}</div>
        {desc && <div style={{fontSize:12,color:D.textMuted,marginTop:3}}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label,desc,checked,onChange }:{label:string;desc?:string;checked:boolean;onChange:(v:boolean)=>void}) {
  return <FieldRow label={label} desc={desc}><Toggle checked={checked} onChange={onChange} /></FieldRow>
}

function SectionCard({ title,icon,children }:{title:string;icon:React.ReactNode;children:React.ReactNode}) {
  return (
    <div style={{background:D.surface,borderRadius:D.rLg,border:`1px solid ${D.border}`,overflow:"hidden",boxShadow:D.shadow,marginBottom:16,backdropFilter:"blur(12px)"}}>
      <div style={{padding:"18px 24px",borderBottom:`1px solid ${D.border}`,display:"flex",alignItems:"center",gap:12,background:"rgba(255,255,255,0.02)"}}>
        <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#0056E7,#1983FD)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 4px 12px rgba(15,98,254,0.35)"}}>
          {icon}
        </div>
        <span style={{fontSize:15,fontWeight:600,color:D.text}}>{title}</span>
      </div>
      <div style={{padding:"0 24px 4px"}}>{children}</div>
    </div>
  )
}

function FieldLabel({ children }:{children:React.ReactNode}) {
  return (
    <div style={{fontSize:11,fontWeight:600,color:D.textMuted,letterSpacing:"0.09em",textTransform:"uppercase",marginBottom:8}}>
      {children}
    </div>
  )
}

function StyledInput({ value,onChange,placeholder,type="text",disabled }:{value:string;onChange:(v:string)=>void;placeholder?:string;type?:string;disabled?:boolean}) {
  const [focused,setFocused]=useState(false)
  return (
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
      style={{
        width:"100%",padding:"12px 16px",fontSize:14,
        border:`1.5px solid ${focused ? D.blue : D.border}`,
        borderRadius:D.rSm,background: focused ? "rgba(15,98,254,0.05)" : D.surface,
        color:disabled?D.textMuted:D.text,fontFamily:D.font,
        outline:"none",boxSizing:"border-box" as const,transition:"all .2s",
        boxShadow: focused ? `0 0 0 3px rgba(15,98,254,0.15)` : "none",
      }}
    />
  )
}

function SaveBtn({ onClick,loading,label="Guardar cambios" }:{onClick:()=>void;loading?:boolean;label?:string}) {
  const [hover,setHover]=useState(false)
  return (
    <button onClick={onClick} disabled={loading}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,
        padding:"12px 28px",
        background: hover && !loading ? "linear-gradient(135deg,#0044c8,#1578e8)" : "linear-gradient(135deg,#0056E7,#1983FD)",
        border:"none",borderRadius:D.rSm,color:"#fff",fontSize:14,
        fontWeight:600,cursor:loading?"default":"pointer",
        fontFamily:D.font,transition:"all .2s",opacity:loading?.65:1,marginTop:20,
        boxShadow: hover && !loading ? "0 8px 24px rgba(15,98,254,0.5)" : "0 4px 16px rgba(15,98,254,0.3)",
        transform: hover && !loading ? "translateY(-1px)" : "translateY(0)",
      }}
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

  const inputBase: React.CSSProperties={
    width:"100%",padding:"12px 16px",fontSize:14,fontFamily:D.font,
    border:`1.5px solid ${D.border}`,borderRadius:D.rSm,
    background:D.surface,color:D.text,outline:"none",
    boxSizing:"border-box",transition:"all .2s",
  }

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
    <div style={{minHeight:"100vh",background:D.bg,fontFamily:D.font}}>
      <style>{`
        @media(max-width:767px){
          .cfg-inner{width:100%!important;margin-left:0!important;padding-bottom:90px!important}
          .cfg-body{grid-template-columns:1fr!important;padding:0 14px 80px!important;margin-top:-20px!important;gap:14px!important}
          .cfg-side{position:relative!important;top:0!important;width:100%!important}
          .cfg-hero{padding:24px 18px 52px!important}
          .cfg-panel{padding:0!important}
          .cfg-2col{grid-template-columns:1fr!important}
        }
        @media(min-width:768px) and (max-width:1160px){
          .cfg-inner{margin-left:220px!important}
          .cfg-body{padding:0 20px 60px!important}
        }
        @media(min-width:1161px){
          .cfg-inner{margin-left:280px!important}
          .cfg-body{padding:0 32px 80px!important}
        }
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .nav-item:hover{background:rgba(255,255,255,0.06)!important}
        select{-webkit-appearance:none;appearance:none}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px rgba(15,98,254,0.05) inset!important;-webkit-text-fill-color:#fff!important}
        input[type="date"]::-webkit-calendar-picker-indicator{opacity:.4;cursor:pointer;filter:invert(1)}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.25)!important}
        .premium-input:focus{border-color:#0F62FE!important;box-shadow:0 0 0 3px rgba(15,98,254,0.2)!important;background:rgba(15,98,254,0.05)!important}
        .save-btn:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(15,98,254,0.5)!important}
        .section-card{animation:fadeUp .3s ease both}
      `}</style>

      <div className="cfg-inner" style={{position:"relative"}}>

        {/* ── Hero ── */}
        <div className="cfg-hero" style={{
          background:"linear-gradient(135deg,#060c1d 0%,#0a1628 60%,#080f20 100%)",
          padding:"clamp(32px,5vw,56px) clamp(24px,5vw,48px) clamp(64px,8vw,88px)",
          position:"relative",overflow:"hidden",
          borderBottom:`1px solid ${D.border}`,
        }}>
          {/* Ambient orbs */}
          <div style={{position:"absolute",top:"-40%",right:"-5%",width:500,height:500,background:"radial-gradient(circle,rgba(15,98,254,0.18) 0%,transparent 65%)",borderRadius:"50%",pointerEvents:"none"}}/>
          <div style={{position:"absolute",bottom:"-30%",left:"5%",width:380,height:380,background:"radial-gradient(circle,rgba(15,98,254,0.10) 0%,transparent 65%)",borderRadius:"50%",pointerEvents:"none"}}/>
          <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"radial-gradient(rgba(255,255,255,.8) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
          {/* Gradient line */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(15,98,254,0.5),transparent)"}}/>

          <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:20}}>
            <div>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(15,98,254,0.12)",border:"1px solid rgba(15,98,254,0.25)",borderRadius:99,padding:"5px 14px",marginBottom:14}}>
                <Settings size={12} color="#0F62FE"/>
                <span style={{fontSize:11,fontWeight:700,color:"#0F62FE",letterSpacing:"0.1em",textTransform:"uppercase"}}>Configuración</span>
              </div>
              <h1 style={{margin:"0 0 8px",fontSize:"clamp(24px,4vw,36px)",fontWeight:700,color:"#fff",letterSpacing:"-0.03em",lineHeight:1.1}}>
                Tu cuenta
              </h1>
              <p style={{margin:0,fontSize:14,color:"rgba(255,255,255,0.5)"}}>
                Gestiona tu perfil, privacidad y preferencias
              </p>
            </div>

            {/* User badge */}
            <div style={{
              display:"inline-flex",alignItems:"center",gap:14,
              background:"rgba(255,255,255,0.06)",backdropFilter:"blur(16px)",
              border:"1px solid rgba(255,255,255,0.12)",borderRadius:48,
              padding:"8px 20px 8px 8px",
              boxShadow:"0 4px 24px rgba(0,0,0,0.3)",
            }}>
              <div style={{
                width:44,height:44,borderRadius:"50%",
                background:"linear-gradient(135deg,#0056E7,#1983FD)",
                display:"flex",alignItems:"center",justifyContent:"center",
                flexShrink:0,overflow:"hidden",
                boxShadow:"0 0 20px rgba(15,98,254,0.5)",
                border:"2px solid rgba(255,255,255,0.15)"
              }}>
                <AvatarDisplay avatar={avatar||{type:"character",id:"robot",character:"robot"}} size={34}/>
              </div>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:"#fff",lineHeight:1.3}}>{fullName||user.email?.split("@")[0]}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:"0.07em"}}>{roleLabel()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="cfg-body" style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:24,marginTop:-36,position:"relative",zIndex:2}}>

          {/* ── Sidebar nav ── */}
          <div className="cfg-side" style={{
            background:"rgba(255,255,255,0.04)",backdropFilter:"blur(16px)",
            borderRadius:D.rLg,border:`1px solid ${D.border}`,
            boxShadow:D.shadow,height:"fit-content",position:"sticky",top:16,alignSelf:"start",overflow:"hidden",
          }}>
            <div style={{fontSize:10,fontWeight:700,color:D.textMuted,letterSpacing:"0.12em",padding:"14px 16px 10px",borderBottom:`1px solid ${D.border}`,textTransform:"uppercase"}}>
              Secciones
            </div>
            <div style={{padding:"6px"}}>
              {navItems.map(s=>{
                const active=activeSection===s.id
                return (
                  <button key={s.id} className="nav-item" onClick={()=>setActiveSection(s.id)}
                    style={{
                      width:"100%",padding:"10px 12px",textAlign:"left",
                      display:"flex",alignItems:"center",gap:10,
                      borderRadius:10,border:"none",fontFamily:D.font,
                      background:active?"rgba(15,98,254,0.15)":"transparent",
                      color:active?"#fff":D.textMid,
                      fontSize:13,fontWeight:active?600:400,
                      cursor:"pointer",transition:"all .2s",marginBottom:2,
                      boxShadow:active?"inset 0 0 0 1px rgba(15,98,254,0.3)":"none",
                    }}
                  >
                    <div style={{
                      width:28,height:28,borderRadius:8,
                      background:active?"linear-gradient(135deg,#0056E7,#1983FD)":"rgba(255,255,255,0.06)",
                      border:`1px solid ${active?"transparent":D.border}`,
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                      transition:"all .2s",
                      boxShadow:active?"0 4px 10px rgba(15,98,254,0.35)":"none",
                    }}>
                      <div style={{color:active?"white":D.textMuted}}>{s.icon}</div>
                    </div>
                    {s.label}
                    {active&&<ChevronRight size={12} color="#0F62FE" style={{marginLeft:"auto"}}/>}
                  </button>
                )
              })}
            </div>

            <div style={{borderTop:`1px solid ${D.border}`,padding:"6px"}}>
              <a href="https://www.instagram.com/bizen.mx?igsh=ZmJmYmdxZHg1Z2E3" target="_blank" rel="noopener noreferrer"
                style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,fontSize:13,color:D.textMid,textDecoration:"none",transition:"all .2s",marginBottom:2}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(225,48,108,0.1)";e.currentTarget.style.color="#E1306C"}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=D.textMid}}
              >
                <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,255,255,0.06)",border:`1px solid ${D.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Instagram size={13} color={D.textMuted}/>
                </div>
                Instagram
              </a>
              <button onClick={()=>setShowResetConfirm(true)}
                style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:"transparent",fontSize:13,color:D.textMuted,fontFamily:D.font,cursor:"pointer",transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(239,68,68,0.1)";e.currentTarget.style.color=D.red}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=D.textMuted}}
              >
                <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,255,255,0.06)",border:`1px solid ${D.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <RotateCcw size={12} color={D.textMuted}/>
                </div>
                Restaurar defaults
              </button>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="cfg-panel">

            {/* Toast */}
            {toast&&(
              <div style={{
                marginBottom:16,padding:"14px 20px",borderRadius:D.rSm,
                display:"flex",alignItems:"center",gap:10,fontSize:13,fontWeight:600,
                background:toast.ok?"rgba(16,185,129,0.1)":"rgba(239,68,68,0.1)",
                border:`1px solid ${toast.ok?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)"}`,
                color:toast.ok?"#34d399":"#f87171",
                animation:"fadeUp .25s ease both",
                backdropFilter:"blur(12px)",
              }}>
                {toast.ok?<Check size={15} color="#34d399"/>:<X size={15} color="#f87171"/>}
                {toast.msg}
              </div>
            )}

            {/* ── GENERAL ── */}
            {activeSection==="general"&&(
              <div className="section-card">
                <SectionCard title="Preferencias del sistema" icon={<Zap size={15} color="white"/>}>
                  <ToggleRow label="Efectos de Sonido" desc="Activar efectos de sonido en la app" checked={settings.soundsEnabled} onChange={v=>updateSettings({soundsEnabled:v})}/>
                  <ToggleRow label="Animaciones" desc="Mostrar animaciones y transiciones suaves" checked={settings.animationsEnabled} onChange={v=>updateSettings({animationsEnabled:v})}/>
                  <div style={{paddingBottom:4}}/>
                </SectionCard>
                <SaveBtn onClick={saveGlobalSettings} loading={saving}/>
              </div>
            )}

            {/* ── PROFILE ── */}
            {activeSection==="profile"&&user&&(
              <div className="section-card">
                {/* Identity preview */}
                <div style={{
                  background:D.surface,borderRadius:D.rLg,border:`1px solid ${D.border}`,
                  boxShadow:D.shadow,marginBottom:16,
                  display:"flex",alignItems:"center",gap:18,padding:"22px 24px",
                  backdropFilter:"blur(12px)",
                  backgroundImage:"linear-gradient(135deg,rgba(15,98,254,0.06) 0%,transparent 60%)",
                }}>
                  <div style={{width:60,height:60,borderRadius:16,background:"linear-gradient(135deg,#0056E7,#1983FD)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"0 8px 24px rgba(15,98,254,0.4)"}}>
                    <AvatarDisplay avatar={avatar||{type:"character",id:"robot",character:"robot"}} size={44} frame={dbProfile?.inventory?.includes("2")?"vip":dbProfile?.inventory?.includes("1")?"ambassador":null}/>
                  </div>
                  <div>
                    <div style={{fontSize:17,fontWeight:700,color:D.text}}>{fullName||"(Sin nombre)"}</div>
                    <div style={{fontSize:13,color:D.textMuted,marginTop:3}}>{username?`@${username.replace("@","")}`:user.email}</div>
                  </div>
                  <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:D.blueDim,border:`1px solid ${D.blueDimHi}`,borderRadius:99,padding:"6px 14px"}}>
                    <Award size={13} color={D.blue}/>
                    <span style={{fontSize:12,fontWeight:600,color:D.blue}}>{roleLabel()}</span>
                  </div>
                </div>

                <SectionCard title="Información personal" icon={<User size={15} color="white"/>}>
                  <div style={{paddingTop:14,display:"grid",gap:14,paddingBottom:14}}>
                    <div>
                      <FieldLabel>Nombre completo</FieldLabel>
                      <StyledInput value={fullName} onChange={setFullName} placeholder="Tu nombre completo"/>
                    </div>
                    <div className="cfg-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                      <div>
                        <FieldLabel>@Username</FieldLabel>
                        <StyledInput value={username} onChange={setUsername} placeholder="usuario123"/>
                      </div>
                      <div>
                        <FieldLabel>Fecha de nacimiento</FieldLabel>
                        <input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)}
                          max={new Date().toISOString().split("T")[0]}
                          className="premium-input"
                          style={{...inputBase}}
                          onFocus={e=>{e.currentTarget.style.borderColor=D.blue}}
                          onBlur={e=>{e.currentTarget.style.borderColor=D.border;e.currentTarget.style.boxShadow="none";e.currentTarget.style.background=D.surface}}
                        />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Bio</FieldLabel>
                      <textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Cuéntale algo a tu comunidad..."
                        className="premium-input"
                        style={{...inputBase,minHeight:80,resize:"vertical" as const}}
                        onFocus={e=>{e.currentTarget.style.borderColor=D.blue}}
                        onBlur={e=>{e.currentTarget.style.borderColor=D.border;e.currentTarget.style.boxShadow="none";e.currentTarget.style.background=D.surface}}
                      />
                    </div>
                    {dbProfile?.role!=="particular"&&(
                      <div>
                        <FieldLabel>Mi Escuela</FieldLabel>
                        <div style={{position:"relative"}}>
                          <select value={schoolId} onChange={e=>setSchoolId(e.target.value)}
                            style={{...inputBase,cursor:"pointer",paddingRight:36}}
                            onFocus={e=>{e.currentTarget.style.borderColor=D.blue}}
                            onBlur={e=>{e.currentTarget.style.borderColor=D.border}}
                          >
                            <option value="">Selecciona tu escuela</option>
                            {schools.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                          <ChevronDown size={14} color={D.textMuted} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>

                <SaveBtn onClick={saveProfile} loading={saving} label="Actualizar perfil"/>

                <div style={{marginTop:24,padding:"18px 20px",background:"linear-gradient(135deg,rgba(15,98,254,0.08),rgba(15,98,254,0.04))",borderRadius:D.rSm,display:"flex",gap:14,alignItems:"center",border:`1px solid rgba(15,98,254,0.2)`}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(15,98,254,0.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid rgba(15,98,254,0.25)`}}>
                    <Sparkles size={18} color={D.blue}/>
                  </div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:D.blue}}>Consejo de Billy</div>
                    <div style={{fontSize:12,color:D.textMid,marginTop:2}}>Tener un nombre de usuario único te ayuda a destacar en los rankings globales. ¡Elige uno que te represente!</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ACCOUNT ── */}
            {activeSection==="account"&&user&&(
              <div className="section-card">
                <SectionCard title="Correo electrónico" icon={<User size={15} color="white"/>}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,paddingBottom:14}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:D.text}}>{user.email}</div>
                      <div style={{fontSize:12,color:D.textMuted,marginTop:3}}>Tu dirección de correo principal</div>
                    </div>
                    <span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,color:D.green,background:D.greenDim,border:"1px solid rgba(16,185,129,0.25)",padding:"5px 12px",borderRadius:20}}>
                      <Check size={11}/>Verificado
                    </span>
                  </div>
                </SectionCard>

                <SectionCard title="Teléfono" icon={<Phone size={15} color="white"/>}>
                  <div style={{paddingTop:14,paddingBottom:14}}>
                    <FieldLabel>Número de contacto</FieldLabel>
                    <div style={{display:"flex",gap:10}}>
                      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)}
                        placeholder="+52 123 456 7890" className="premium-input"
                        style={{...inputBase,flex:1}}
                        onFocus={e=>{e.currentTarget.style.borderColor=D.blue}}
                        onBlur={e=>{e.currentTarget.style.borderColor=D.border;e.currentTarget.style.boxShadow="none";e.currentTarget.style.background=D.surface}}
                      />
                      <button onClick={savePhone} disabled={saving}
                        style={{padding:"12px 22px",background:"linear-gradient(135deg,#0056E7,#1983FD)",border:"none",borderRadius:D.rSm,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:D.font,opacity:saving?.6:1,whiteSpace:"nowrap",boxShadow:"0 4px 12px rgba(15,98,254,0.3)"}}
                      >
                        {saving?"...":"Guardar"}
                      </button>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Contraseña" icon={<Lock size={15} color="white"/>}>
                  <div style={{paddingTop:14,paddingBottom:showPwFields?0:14}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{fontSize:14,color:D.textMuted,letterSpacing:"0.1em"}}>
                        {showPwFields?"Introduce tu nueva contraseña":"••••••••••••"}
                      </div>
                      <button onClick={()=>{setShowPwFields(!showPwFields);setPw({new:"",confirm:""})}}
                        style={{padding:"8px 16px",background:showPwFields?"rgba(239,68,68,0.12)":D.surfaceHi,border:`1px solid ${showPwFields?"rgba(239,68,68,0.3)":D.border}`,borderRadius:D.rSm,color:showPwFields?D.red:D.textMid,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:D.font,transition:"all .2s"}}
                      >
                        {showPwFields?"Cancelar":"Cambiar"}
                      </button>
                    </div>
                    {showPwFields&&(
                      <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:14,paddingBottom:14}}>
                        <input type="password" value={pw.new} onChange={e=>setPw({...pw,new:e.target.value})}
                          placeholder="Nueva contraseña (mín. 6 caracteres)" className="premium-input"
                          style={inputBase}
                          onFocus={e=>{e.currentTarget.style.borderColor=D.blue}}
                          onBlur={e=>{e.currentTarget.style.borderColor=D.border;e.currentTarget.style.boxShadow="none";e.currentTarget.style.background=D.surface}}
                        />
                        <input type="password" value={pw.confirm} onChange={e=>setPw({...pw,confirm:e.target.value})}
                          placeholder="Confirmar contraseña" className="premium-input"
                          style={inputBase}
                          onFocus={e=>{e.currentTarget.style.borderColor=D.blue}}
                          onBlur={e=>{e.currentTarget.style.borderColor=D.border;e.currentTarget.style.boxShadow="none";e.currentTarget.style.background=D.surface}}
                        />
                        <SaveBtn onClick={savePw} loading={saving} label="Actualizar contraseña"/>
                      </div>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Sesión y cuenta" icon={<LogOut size={15} color="white"/>}>
                  <div style={{paddingTop:14}}>
                    <div className="cfg-2col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                      {[
                        {l:"Cuenta creada",v:new Date(user.created_at||Date.now()).toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"})},
                        {l:"Método de acceso",v:"Email y contraseña"},
                      ].map(({l,v})=>(
                        <div key={l} style={{padding:"14px 16px",background:"rgba(255,255,255,0.04)",borderRadius:12,border:`1px solid ${D.border}`}}>
                          <div style={{fontSize:10,color:D.textMuted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{l}</div>
                          <div style={{fontSize:13,fontWeight:600,color:D.text}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap",paddingBottom:14}}>
                      <button disabled={saving}
                        onClick={async()=>{if(!supabase)return;setSaving(true);try{await supabase.auth.signOut();router.push("/login")}catch{flash(false,"Error al cerrar sesión")}finally{setSaving(false)}}}
                        style={{padding:"11px 24px",background:"linear-gradient(135deg,#c0392b,#EF4444)",border:"none",borderRadius:D.rSm,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:D.font,opacity:saving?.6:1,boxShadow:"0 4px 12px rgba(239,68,68,0.3)",transition:"all .2s"}}
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
                  <div style={{paddingTop:14,display:"flex",flexDirection:"column",gap:14,paddingBottom:14}}>
                    {[{k:"profileVisibility",l:"Visibilidad de Perfil en P2P"}].map(({k,l})=>(
                      <div key={k}>
                        <FieldLabel>{l}</FieldLabel>
                        <div style={{position:"relative"}}>
                          <select value={(settings.privacy as any)[k]}
                            onChange={e=>updateSettings({privacy:{...settings.privacy,[k]:e.target.value as any}})}
                            style={{...inputBase,cursor:"pointer",maxWidth:300,paddingRight:36}}
                            onFocus={e=>{e.currentTarget.style.borderColor=D.blue}}
                            onBlur={e=>{e.currentTarget.style.borderColor=D.border}}
                          >
                            <option value="public">Público (Aparecer en búsquedas)</option>
                            <option value="private">Privado (Modo incógnito)</option>
                          </select>
                          <ChevronDown size={14} color={D.textMuted} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}}/>
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
                  <div style={{paddingBottom:4}}/>
                </SectionCard>
                <SaveBtn onClick={saveGlobalSettings} loading={saving} label="Guardar privacidad"/>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── Reset Modal ── */}
      {showResetConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:24}}>
          <div style={{background:"#0d1b36",borderRadius:D.rLg,padding:"40px 36px",maxWidth:380,width:"100%",boxShadow:"0 32px 80px rgba(0,0,0,0.6)",border:`1px solid rgba(239,68,68,0.2)`,animation:"scaleIn .25s ease both"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.25)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <AlertTriangle size={24} color={D.red}/>
              </div>
            </div>
            <h3 style={{margin:"0 0 8px",fontSize:18,fontWeight:700,color:D.text,textAlign:"center"}}>¿Restaurar configuración?</h3>
            <p style={{margin:"0 0 28px",fontSize:13,color:D.textMuted,lineHeight:1.6,textAlign:"center"}}>Esto restablecerá todas tus preferencias a los valores predeterminados.</p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowResetConfirm(false)}
                style={{flex:1,padding:"12px",background:"rgba(255,255,255,0.06)",border:`1px solid ${D.border}`,borderRadius:D.rSm,color:D.textMid,fontSize:13,fontWeight:600,cursor:"pointer"}}
              >Cancelar</button>
              <button onClick={async()=>{resetSettings();setShowResetConfirm(false);await syncToDB({settings:{}});flash(true,"Configuración restaurada")}}
                style={{flex:1,padding:"12px",background:"linear-gradient(135deg,#c0392b,#EF4444)",border:"none",borderRadius:D.rSm,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:"0 4px 12px rgba(239,68,68,0.3)"}}
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
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:"#0F62FE",background:"#080f1e",minHeight:"100vh"}}>
        <div style={{textAlign:"center"}}>
          <Settings size={32} color="#0F62FE" style={{marginBottom:12,opacity:0.6}}/>
          <div>Cargando configuración...</div>
        </div>
      </div>
    }>
      <SettingsContent/>
    </Suspense>
  )
}
