'use client';

import React, { useState } from 'react';
import { 
  Settings, User, Building, Mail, Phone, Lock, 
  ShieldCheck, HelpCircle, Save, CheckCircle2 
} from 'lucide-react';
import PageLoader from '@/components/PageLoader';

export default function TeacherSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Prof. Ana García',
    email: 'ana.garcia@colegio-ejemplo.edu.mx',
    phone: '55 1234 5678',
    schoolName: 'Colegio Ejemplo Internacional',
    department: 'Ciencias Sociales y Economía',
    notifications: true,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    
    // Simular guardado
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-50 px-5 md:px-8 lg:px-11 py-10 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-[fadeSlideUp_0.4s_ease_both]">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
            <span className="w-8 h-[2px] bg-blue-500 rounded-full" />
            Configuración
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight m-0">
            Ajustes del <span className="text-blue-600">Docente</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Gestiona tu perfil personal y las preferencias de tu institución.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Perfil Personal */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm animate-[fadeSlideUp_0.5s_ease_both]">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <User size={20} className="text-blue-500" /> Perfil Personal
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    disabled
                    value={formData.email}
                    className="w-full h-12 pl-11 pr-4 bg-slate-100 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Teléfono (Opcional)
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información Institucional */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm animate-[fadeSlideUp_0.6s_ease_both]">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Building size={20} className="text-purple-500" /> Info. Institucional
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Institución Educativa
                </label>
                <input 
                  type="text" 
                  disabled
                  value={formData.schoolName}
                  className="w-full h-12 px-4 bg-slate-100 border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-2">Para cambiar la institución, contacta a soporte.</p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Departamento / Área
                </label>
                <input 
                  type="text" 
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full h-12 px-4 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Notificaciones y Seguridad */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm animate-[fadeSlideUp_0.7s_ease_both]">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <ShieldCheck size={20} className="text-emerald-500" /> Preferencias y Seguridad
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Notificaciones de Riesgo</div>
                  <div className="text-xs text-slate-500 mt-0.5">Recibir alertas por correo sobre alumnos inactivos o con bajas calificaciones.</div>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.notifications ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                {/* Oculto, manejado por el div superior visualmente */}
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({...formData, notifications: e.target.checked})}
                />
              </label>

              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div>
                  <div className="font-bold text-slate-900 text-sm">Contraseña</div>
                  <div className="text-xs text-slate-500 mt-0.5">La contraseña se gestiona a través de tu proveedor de identidad (Clerk).</div>
                </div>
                <button type="button" className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
                  Cambiar
                </button>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-4 animate-[fadeSlideUp_0.8s_ease_both]">
            {saved && (
              <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Cambios guardados
              </span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
