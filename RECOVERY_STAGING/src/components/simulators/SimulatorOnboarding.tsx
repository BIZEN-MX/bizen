"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, BarChart2, TrendingUp, Activity, Clock, Target, Flame } from "lucide-react";

const STEPS = [
  {
    title: "¡Bienvenido al Bizen Market!",
    text: "Soy Billy, tu guía financiero. Este es el simulador de inversiones donde usarás tus Bizcoins virtuales para practicar en el mercado real sin riesgo. ¿Listo para el tour?",
    icon: <BarChart2 size={24} className="text-blue-500" />,
    image: "/billy_pointing.png"
  },
  {
    title: "Mercado",
    text: "Aquí verás todos los activos disponibles (como Apple o el S&P 500). Puedes comprar o vender acciones; recuerda que usaremos los precios de cierre reales para las operaciones.",
    icon: <TrendingUp size={24} className="text-emerald-500" />,
    image: "/billy_stock_market_1776192269465.png"
  },
  {
    title: "Mi Portafolio",
    text: "Mantén bajo la lupa todas las acciones y ETFs que ya tienes. Revisa si vas en verde (ganancias) o en rojo (pérdidas) frente a tu inversión inicial.",
    icon: <BarChart2 size={24} className="text-[#0B1E5E]" />,
    image: "/billy_personal_finance_1776192246184.png"
  },
  {
    title: "Analytics",
    text: "Te daré gráficos detallados sobre tu rendimiento a lo largo del tiempo, la diversificación de tu cartera y sugerencias de cómo ajustarla.",
    icon: <Activity size={24} className="text-purple-500" />,
    image: "/billy_business_finance_1776192292938.png"
  },
  {
    title: "Watchlist y Alertas",
    text: "¿Un activo te llama la atención pero aún no quieres comprarlo? Añádelo a tu Watchlist. Además puedes configurar alertas que te notifiquen si el precio llega al límite que pusiste.",
    icon: <Target size={24} className="text-rose-500" />,
    image: "/billy_hero.png"
  },
  {
    title: "Historial y Rankings",
    text: "Comprueba tu historial de trading para aprender de tus movimientos y entra a Rankings para competir con otros estudiantes. ¡Es hora de convertirte en un experto!",
    icon: <Flame size={24} className="text-orange-500" />,
    image: "/billy_hero_welcome_1776193486679.png"
  }
];

export function SimulatorOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem("bizen_simulator_onboarding_seen");
    if (!seen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("bizen_simulator_onboarding_seen", "true");
    setIsOpen(false);
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const currentStep = STEPS[step];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-slate-100"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-[220px] bg-gradient-to-b from-[#0B1E5E]/5 to-blue-500/10 p-6 flex flex-col items-center justify-center shrink-0 border-r border-slate-100">
            <motion.img 
              key={currentStep.image}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              src={currentStep.image} 
              alt="Billy" 
              className="w-32 h-auto object-contain drop-shadow-xl"
            />
          </div>
          
          <div className="flex-1 p-8 flex flex-col justify-center">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm">
                  {currentStep.icon}
                </div>
                <h3 className="text-xl font-extrabold text-slate-800 m-0">
                  {currentStep.title}
                </h3>
              </div>
              
              <p className="text-[15px] font-medium text-slate-500 leading-relaxed min-h-[80px]">
                {currentStep.text}
              </p>
            </motion.div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === step ? "w-6 bg-blue-600" : "w-2 bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-[14px] shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
              >
                {step === STEPS.length - 1 ? (
                  "Empezar a invertir"
                ) : (
                  <>Siguiente <ChevronRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
