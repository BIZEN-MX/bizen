export type QuizOption = {
  value: "A" | "B" | "C" | "D"
  text: string
}

export type QuizQuestion = {
  id: string
  label: string
  level: "Basico" | "Intermedio" | "Avanzado"
  question: string
  options: QuizOption[]
  answer: QuizOption["value"]
}

export const diagnosticQuiz: QuizQuestion[] = [
  // --- CRÉDITO Y DEUDA ---
  {
    id: "cr-1",
    label: "Crédito",
    level: "Intermedio",
    question: "Ves dos opciones para un préstamo personal: La Opción A tiene una tasa de interés del 20% y un CAT del 35%. La Opción B tiene una tasa del 25% y un CAT del 30%. ¿Cuál es más barata financieramente?",
    options: [
      { value: "A", text: "Opción A, porque la tasa de interés nominal es menor." },
      { value: "B", text: "Opción B, porque el CAT (Costo Anual Total) incluye comisiones y seguros." },
      { value: "C", text: "Son iguales, el costo final depende solo del plazo que elijas." },
      { value: "D", text: "Depende de mi historial crediticio, no del CAT." },
    ],
    answer: "B",
  },
  {
    id: "cr-2",
    label: "Crédito",
    level: "Avanzado",
    question: "Tienes un saldo de $10,000 en tu tarjeta de crédito con una tasa del 50% anual. Si decides pagar solo el 'Mínimo' ($500) cada mes, ¿qué sucederá con el total de tu deuda?",
    options: [
      { value: "A", text: "Se liquidará en aproximadamente 20 meses sin generar recargos." },
      { value: "B", text: "Crecerá con el tiempo, ya que el interés mensual es mayor a tu abono al capital." },
      { value: "C", text: "Se mantendrá congelada mientras no hagas nuevas compras." },
      { value: "D", text: "El banco reducirá la tasa de interés como premio por pago puntual." },
    ],
    answer: "B",
  },

  // --- AHORRO Y PRESUPUESTO ---
  {
    id: "ah-1",
    label: "Ahorro",
    level: "Basico",
    question: "Tus gastos básicos mensuales son de $5,000. Actualmente tienes un fondo de $3,000 y acabas de perder tu fuente de ingresos. ¿Cuál es la decisión más responsable?",
    options: [
      { value: "A", text: "Invertir los $3,000 en acciones volátiles para duplicarlos rápido." },
      { value: "B", text: "Eliminar gastos variables (ocio) al 0% y usar el fondo solo para lo vital." },
      { value: "C", text: "Pedir un préstamo personal inmediato para no gastar mis ahorros." },
      { value: "D", text: "Pagar solo el mínimo de mis créditos para conservar el efectivo." },
    ],
    answer: "B",
  },
  {
    id: "ah-2",
    label: "Presupuesto",
    level: "Intermedio",
    question: "Sigues la regla 50/30/20. Si ganas $10,000 pero tus 'Deseos' (entretenimiento, ropa) ya suman $5,000 este mes, ¿qué ajuste es necesario?",
    options: [
      { value: "A", text: "Reducir mis Deseos en $2,000 para poder cumplir con el 20% de ahorro/inversión." },
      { value: "B", text: "Reducir mis necesidades básicas para poder mantener mi estilo de vida." },
      { value: "C", text: "No ahorrar este mes y esperar a que el próximo mes me sobre más dinero." },
      { value: "D", text: "Seguir igual, la regla 50/30/20 es solo una sugerencia opcional." },
    ],
    answer: "A",
  },

  // --- INVERSIÓN Y RIESGO ---
  {
    id: "inv-1",
    label: "Inversión",
    level: "Avanzado",
    question: "Inviertes en un fondo que te da el 8% de rendimiento bruto anual. Si la inflación de ese año fue del 10%, ¿cuál fue tu rentabilidad real?",
    options: [
      { value: "A", text: "Gané un 8% de rendimiento real positivo." },
      { value: "B", text: "Perdí un 2% de mi poder adquisitivo (rendimiento real negativo)." },
      { value: "C", text: "Gané un 18% sumando el rendimiento y la inflación." },
      { value: "D", text: "Mi dinero mantuvo su valor exactamente igual." },
    ],
    answer: "B",
  },
  {
    id: "inv-2",
    label: "Inversión",
    level: "Intermedio",
    question: "¿Cuál es el riesgo principal de invertir todo tu dinero en una sola empresa (ej. NVIDIA) frente a un ETF diversificado (ej. QQQ)?",
    options: [
      { value: "A", text: "Las empresas individuales son siempre más seguras que los fondos." },
      { value: "B", text: "El riesgo no sistemático: si a esa empresa le va mal, pierdes todo tu capital." },
      { value: "C", text: "Los ETFs cobran comisiones que hacen que nunca ganes dinero." },
      { value: "D", text: "No hay diferencia real, ambos dependen del mercado general." },
    ],
    answer: "B",
  },
  {
    id: "inv-3",
    label: "Inversión",
    level: "Avanzado",
    question: "Inviertes $1,000 a una tasa del 10% anual con capitalización mensual. ¿Cómo afecta esto al monto final comparado con la capitalización anual?",
    options: [
      { value: "A", text: "Obtienes más dinero gracias al efecto del interés sobre interés cada mes." },
      { value: "B", text: "Obtienes menos dinero debido a los costos operativos mensuales." },
      { value: "C", text: "El resultado es idéntico, la frecuencia no afecta el rendimiento final." },
      { value: "D", text: "La capitalización mensual solo sirve para cuentas de ahorro, no inversión." },
    ],
    answer: "A",
  },

  // --- SEGURIDAD Y HERRAMIENTAS ---
  {
    id: "seg-1",
    label: "Seguridad",
    level: "Basico",
    question: "Recibes un correo de 'soporte' con dominio '@gmail.com' avisando que tu cuenta bancaria fue bloqueada y pide tus claves. ¿Qué haces?",
    options: [
      { value: "A", text: "Hacer clic en el enlace de inmediato para evitar el bloqueo." },
      { value: "B", text: "Ignorar y borrar: las instituciones oficiales no usan dominios gratuitos para soporte." },
      { value: "C", text: "Responder pidiendo pruebas de que realmente son del banco." },
      { value: "D", text: "Llamar a mi banco para reclamarles por enviarme correos de Gmail." },
    ],
    answer: "B",
  },
  {
    id: "seg-2",
    label: "Gestión",
    level: "Intermedio",
    question: "Quieres comprar una laptop de $12,000 en un año. Tienes 3 opciones claras, ¿cuál es la mejor financieramente?",
    options: [
      { value: "A", text: "Ahorrar $1,000 mensuales en efectivo guardado en casa." },
      { value: "B", text: "Invertir los $1,000 mensuales en un instrumento de bajo riesgo como Cetes/Sofipos." },
      { value: "C", text: "Sacarla a crédito hoy y pagar $1,500 mensuales por 12 meses." },
      { value: "D", text: "No comprarla y esperar a que alguien me la regale." },
    ],
    answer: "B",
  },

  // --- PLANIFICACIÓN ---
  {
    id: "sys-1",
    label: "Gestión",
    level: "Intermedio",
    question: "Te sobran $500 este mes. ¿Qué decisión tiene el mayor impacto positivo en tu estabilidad financiera a largo plazo?",
    options: [
      { value: "A", text: "Comprar ropa de marca que tiene un 50% de descuento." },
      { value: "B", text: "Abonar a capital de tu deuda con la tasa de interés más alta." },
      { value: "C", text: "Gastar en una cena de lujo para celebrar que me sobró dinero." },
      { value: "D", text: "Dejarlos en mi cuenta corriente sin moverlos." },
    ],
    answer: "B",
  },
]
