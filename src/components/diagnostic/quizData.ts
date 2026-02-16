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
    id: "ahorro-2",
    label: "Ahorro y Presupuesto",
    question:
      "Yo tengo que pagar un seguro anual de $7,200 en 9 meses. Yo separo dinero cada mes en una cuenta que paga 4% anual (capitaliza mensual). Cuánto debo apartar al mes aprox para llegar a $7,200.",
    options: [
      { value: "A", text: "$720" },
      { value: "B", text: "$790" },
      { value: "C", text: "$800" },
      { value: "D", text: "$880" },
    ],
    answer: "B",
  },
  {
    id: "ahorro-3",
    label: "Ahorro y Presupuesto",
    question:
      "Un producto cuesta $12,000. Opción A: pago hoy y me hacen 10% de descuento (pago $10,800). Opción B: 12 meses sin intereses de $1,000. Yo puedo invertir mi dinero al 8% anual. En “valor de hoy”, qué me sale más barato.",
    options: [
      { value: "A", text: "Pagar hoy con descuento" },
      { value: "B", text: "12 MSI" },
      { value: "C", text: "Es igual" },
      { value: "D", text: "Depende solo del dólar" },
    ],
    answer: "A",
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
    id: "ahorro-5",
    label: "Ahorro y Presupuesto",
    question:
      "Yo tengo 3 suscripciones: $199, $149 y $279 al mes. Si no las cancelo, cuánto gasto en un año.",
    options: [
      { value: "A", text: "$6,372" },
      { value: "B", text: "$7,524" },
      { value: "C", text: "$7,200" },
      { value: "D", text: "$8,100" },
    ],
    answer: "B",
  },
  {
    id: "ahorro-6",
    label: "Ahorro y Presupuesto",
    question:
      "Yo tengo: $15,000 en ahorro, un celular que podría vender en $6,000, un coche que vale $70,000, y un amigo me debe $4,000. Yo debo: $9,000 de tarjeta y $45,000 del coche. Cuál es mi patrimonio neto (assets - deudas).",
    options: [
      { value: "A", text: "$41,000" },
      { value: "B", text: "$54,000" },
      { value: "C", text: "$95,000" },
      { value: "D", text: "$36,000" },
    ],
    answer: "A",
  },
  {
    id: "credito-1",
    label: "Crédito, Deuda y Seguridad",
    question:
      "Yo pido $50,000 por 12 meses. Opción 1: 24% anual, sin comisión. Opción 2: 20% anual, pero comisión de apertura de $2,000. Si solo comparo costo total aproximado del primer año, qué es más cierto.",
    options: [
      { value: "A", text: "La opción 1 siempre es más barata" },
      { value: "B", text: "La opción 2 siempre es más barata" },
      { value: "C", text: "Quedan muy parecidas en costo total" },
      { value: "D", text: "No se puede comparar con nada" },
    ],
    answer: "C",
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
    id: "credito-3",
    label: "Crédito, Deuda y Seguridad",
    question:
      "Yo tengo dos deudas y $2,000 extra al mes para abonar (aparte de mínimos). Deuda A: $10,000 al 60% anual. Deuda B: $20,000 al 20% anual. Qué estrategia baja más el total de intereses pagados.",
    options: [
      { value: "A", text: "Pagar extra a la deuda B por ser más grande" },
      { value: "B", text: "Pagar extra a la deuda A por tener tasa más alta" },
      { value: "C", text: "Repartir el extra mitad y mitad siempre" },
      { value: "D", text: "No pagar extra, solo mínimos" },
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
    id: "credito-5",
    label: "Crédito, Deuda y Seguridad",
    question:
      "Yo compro algo de $12,000 a 12 MSI. Para usar esa tarjeta me cobran anualidad de $1,200 (y yo solo la saco por esta compra). En la práctica, cuánto termina costando mi compra contando esa anualidad.",
    options: [
      { value: "A", text: "$12,000" },
      { value: "B", text: "$12,600" },
      { value: "C", text: "$13,200" },
      { value: "D", text: "$10,800" },
    ],
    answer: "C",
  },
  {
    id: "credito-6",
    label: "Crédito, Deuda y Seguridad",
    question:
      "Yo tengo un seguro con deducible de $3,000 y coaseguro de 10% después del deducible. Tengo un gasto de $20,000. Cuánto pago yo en total.",
    options: [
      { value: "A", text: "$3,000" },
      { value: "B", text: "$4,700" },
      { value: "C", text: "$5,000" },
      { value: "D", text: "$2,000" },
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
    id: "inversion-1",
    label: "Inversión y Retiro",
    question:
      "Yo invierto y gano 9% en el año, pero la inflación fue 5%. Aproximado, cuál es mi rendimiento real.",
    options: [
      { value: "A", text: "3.8% aprox" },
      { value: "B", text: "4.0% exacto siempre" },
      { value: "C", text: "9%" },
      { value: "D", text: "14%" },
    ],
    answer: "A",
  },
  {
    id: "inversion-2",
    label: "Inversión y Retiro",
    question:
      "Yo armo un portafolio con dos inversiones. Si una sube cuando la otra baja (correlación baja o negativa), eso normalmente:",
    options: [
      { value: "A", text: "Aumenta el riesgo total" },
      { value: "B", text: "Reduce el riesgo total sin “garantizar” ganancias" },
      { value: "C", text: "Elimina el riesgo por completo" },
      { value: "D", text: "Hace que siempre gane el doble" },
    ],
    answer: "B",
  },
  {
    id: "inversion-3",
    label: "Inversión y Retiro",
    question:
      "Suben las tasas 1%. Tengo dos bonos: Bono A: vence en 2 años. Bono B: vence en 10 años. Cuál suele caer más en precio (en porcentaje) por el alza de tasas.",
    options: [
      { value: "A", text: "Bono A" },
      { value: "B", text: "Bono B" },
      { value: "C", text: "Caen igual" },
      { value: "D", text: "Ninguno cambia" },
    ],
    answer: "B",
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
    id: "inversion-6",
    label: "Inversión y Retiro",
    question:
      "Yo meto $500 al mes por 10 años en una inversión tipo retiro que da 7% anual (aprox). Cuánto junto al final aprox.",
    options: [
      { value: "A", text: "$60,000" },
      { value: "B", text: "$86,500" },
      { value: "C", text: "$72,000" },
      { value: "D", text: "$110,000" },
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
    id: "economia-2",
    label: "Economía e Impuestos",
    question:
      "Yo gano $15,000 brutos al mes. Me retienen 12% de ISR y 5% de otras deducciones. Cuánto me queda neto.",
    options: [
      { value: "A", text: "$13,200" },
      { value: "B", text: "$12,450" },
      { value: "C", text: "$12,000" },
      { value: "D", text: "$10,950" },
    ],
    answer: "B",
  },
  {
    id: "economia-3",
    label: "Economía e Impuestos",
    question: "Yo compro USD 500. El tipo de cambio es 17.80, pero el banco me cobra 2% extra (spread). Cuánto pago en pesos.",
    options: [
      { value: "A", text: "$8,900" },
      { value: "B", text: "$9,078" },
      { value: "C", text: "$9,180" },
      { value: "D", text: "$8,556" },
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
  {
    id: "economia-5",
    label: "Economía e Impuestos",
    question:
      "Dos países tienen la misma inflación, pero el País X tiene más riesgo de no pagar su deuda. Qué es lo más normal que pase con las tasas que ofrece X para que le presten.",
    options: [
      { value: "A", text: "Ofrece tasas más bajas" },
      { value: "B", text: "Ofrece tasas más altas" },
      { value: "C", text: "Ofrece exactamente lo mismo siempre" },
      { value: "D", text: "Ya no puede pedir prestado nunca" },
    ],
    answer: "B",
  },
]
