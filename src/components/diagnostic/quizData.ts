export type QuizOption = {
  value: "A" | "B" | "C" | "D"
  text: string
}

export type QuizQuestion = {
  id: string
  label: string
  question: string
  options: QuizOption[]
  answer: QuizOption["value"]
}

export const diagnosticQuiz: QuizQuestion[] = [
  {
    id: "ahorro-1",
    label: "Ahorro y Presupuesto",
    question:
      "Yo gano $3,200 fijo y en promedio $600 extra al mes. Mis gastos “sí o sí” son $2,050. Yo quiero ahorrar 25% de mi ingreso total. Cuánto es lo máximo que puedo gastar en “gustos” ese mes.",
    options: [
      { value: "A", text: "$650" },
      { value: "B", text: "$800" },
      { value: "C", text: "$950" },
      { value: "D", text: "$1,100" },
    ],
    answer: "B",
  },
  {
    id: "ahorro-4",
    label: "Ahorro y Presupuesto",
    question:
      "Mis gastos básicos mensuales (comida, renta, transporte) son $8,200. Yo quiero un fondo de emergencia de 5 meses. Cuánto necesito.",
    options: [
      { value: "A", text: "$32,800" },
      { value: "B", text: "$41,000" },
      { value: "C", text: "$49,200" },
      { value: "D", text: "$20,500" },
    ],
    answer: "B",
  },
  {
    id: "credito-2",
    label: "Crédito, Deuda y Seguridad",
    question:
      "Yo dejo $18,000 en mi tarjeta de crédito. La tasa es 60% anual. Aproximando simple, cuánto interés me cobran en 1 mes si no pago nada.",
    options: [
      { value: "A", text: "$300" },
      { value: "B", text: "$900" },
      { value: "C", text: "$1,800" },
      { value: "D", text: "$5,400" },
    ],
    answer: "B",
  },
  {
    id: "credito-4",
    label: "Crédito, Deuda y Seguridad",
    question:
      "Mi límite de tarjeta es $20,000. En el mes llego a deber $18,000. Si quiero que mi historial se vea mejor, qué me conviene más hacer antes de la fecha de corte.",
    options: [
      { value: "A", text: "Pagar después del corte" },
      {
        value: "B",
        text: "Pagar antes del corte para que el saldo reportado sea menor",
      },
      { value: "C", text: "No pagar nada para que el banco vea que la uso mucho" },
      { value: "D", text: "Cancelarla en ese momento" },
    ],
    answer: "B",
  },
  {
    id: "credito-7",
    label: "Crédito, Deuda y Seguridad",
    question: "Qué acción reduce más el riesgo de que me roben mi cuenta bancaria en línea.",
    options: [
      { value: "A", text: "Usar la misma contraseña en todo para no olvidarla" },
      { value: "B", text: "Mandar el código SMS (OTP) si “soporte” me lo pide" },
      {
        value: "C",
        text: "Contraseña única + verificación en 2 pasos + no abrir links raros",
      },
      { value: "D", text: "Poner mi NIP en notas del celular" },
    ],
    answer: "C",
  },
  {
    id: "inversion-4",
    label: "Inversión y Retiro",
    question: "Qué opción baja más el riesgo de que “una sola empresa” me destruya el rendimiento.",
    options: [
      { value: "A", text: "Comprar 1 acción porque “yo confío”" },
      { value: "B", text: "Comprar un ETF que trae muchas empresas" },
      { value: "C", text: "Meter todo a la empresa que está de moda" },
      { value: "D", text: "Comprar solo una cripto" },
    ],
    answer: "B",
  },
  {
    id: "inversion-5",
    label: "Inversión y Retiro",
    question: "Yo empiezo a ahorrar para retiro temprano. Qué ventaja es la más real.",
    options: [
      { value: "A", text: "Me vuelvo rico seguro" },
      { value: "B", text: "El interés compuesto trabaja más tiempo a mi favor" },
      { value: "C", text: "No necesito invertir nunca" },
      { value: "D", text: "Ya no existe el riesgo" },
    ],
    answer: "B",
  },
  {
    id: "inversion-7",
    label: "Inversión y Retiro",
    question:
      "Yo necesito el dinero sí o sí en 1 año para colegiatura. Qué instrumento suele tener más sentido por riesgo y tiempo.",
    options: [
      { value: "A", text: "Acciones (bolsa)" },
      { value: "B", text: "Cripto" },
      { value: "C", text: "Bono a 10 años" },
      { value: "D", text: "CETES a corto plazo / inversión muy conservadora" },
    ],
    answer: "D",
  },
  {
    id: "economia-1",
    label: "Economía e Impuestos",
    question: "Un precio final ya trae IVA de 16% y dice $5,800. Cuál era el precio antes de IVA.",
    options: [
      { value: "A", text: "$4,640" },
      { value: "B", text: "$5,000" },
      { value: "C", text: "$5,800" },
      { value: "D", text: "$6,728" },
    ],
    answer: "B",
  },
  {
    id: "economia-4",
    label: "Economía e Impuestos",
    question: "Si Banxico sube la tasa de interés, normalmente qué pasa.",
    options: [
      { value: "A", text: "Los créditos se abaratan y los bonos suben de precio" },
      { value: "B", text: "Los créditos se abaratan y los bonos bajan de precio" },
      { value: "C", text: "Los créditos se encarecen y los bonos ya emitidos bajan de precio" },
      { value: "D", text: "No pasa nada" },
    ],
    answer: "C",
  },
]
