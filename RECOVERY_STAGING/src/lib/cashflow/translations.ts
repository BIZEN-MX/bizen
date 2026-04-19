type CardWithText = {
  name?: string | null
  description?: string | null
  [key: string]: any
}

type TranslationEntry = {
  name: string
  description: string
}

const opportunityCardTranslations: Record<string, TranslationEntry> = {
  "1Br/1Ba Condo": {
    name: "Condominio 1 rec / 1 baño",
    description: "Condominio tipo estudio en un vecindario decente. Excelente inversión para principiantes."
  },
  "2Br/1Ba House": {
    name: "Casa 2 rec / 1 baño",
    description: "Casa sencilla en zona de clase trabajadora. Ideal para iniciar tu portafolio."
  },
  "2Br/1Ba Condo": {
    name: "Condominio 2 rec / 1 baño",
    description: "Condominio frente al agua con alta demanda de renta."
  },
  "3Br/1Ba House": {
    name: "Casa 3 rec / 1 baño",
    description: "Hogar familiar en los suburbios con inquilinos estables."
  },
  "3Br/2Ba House": {
    name: "Casa 3 rec / 2 baños",
    description: "Casa bien mantenida con cochera. Lista para rentarse."
  },
  "2Br/2Ba Townhouse": {
    name: "Casa adosada 2 rec / 2 baños",
    description: "Townhouse moderna en una zona que está creciendo rápido."
  },
  "4Br/2Ba House": {
    name: "Casa 4 rec / 2 baños",
    description: "Amplia casa familiar con sótano en un área de alta demanda."
  },
  "3Br/2Ba Ranch": {
    name: "Casa estilo rancho 3 rec / 2 baños",
    description: "Casa estilo rancho en lote grande con espacio para ampliar."
  },
  "4Br/3Ba Colonial": {
    name: "Casa colonial 4 rec / 3 baños",
    description: "Clásica casa colonial en vecindario consolidado."
  },
  "Lake House": {
    name: "Casa junto al lago",
    description: "Propiedad vacacional cerca de un lago popular. Ingresos estacionales."
  },
  "Duplex": {
    name: "Dúplex",
    description: "Dúplex lado a lado. Dos flujos de ingreso en una sola compra."
  },
  "Triplex": {
    name: "Tríplex",
    description: "Edificio de tres unidades en ciudad universitaria con inquilinos estudiantes."
  },
  "4-Plex": {
    name: "4-plex",
    description: "Cuatro unidades con administración profesional. Ingreso estable."
  },
  "6-Plex Apartment": {
    name: "Departamento 6-plex",
    description: "Edificio de seis unidades en zona urbana."
  },
  "8-Plex Apartment": {
    name: "Departamento 8-plex",
    description: "Ocho unidades con lavandería en sitio y gran flujo de efectivo."
  },
  "12-Plex Complex": {
    name: "Complejo 12-plex",
    description: "Complejo de 12 unidades con estacionamiento."
  },
  "20-Plex Apartment": {
    name: "Departamento 20-plex",
    description: "Edificio grande de 20 unidades. Requiere administración profesional."
  },
  "30-Plex Complex": {
    name: "Complejo 30-plex",
    description: "Gran complejo residencial con amenidades."
  },
  "Retail Strip Mall": {
    name: "Plaza comercial",
    description: "Plaza con 5 locales minoristas y múltiples inquilinos."
  },
  "Office Building": {
    name: "Edificio de oficinas",
    description: "Edificio de oficinas de tres pisos en el centro con contratos a largo plazo."
  },
  "Warehouse": {
    name: "Bodega industrial",
    description: "Bodega industrial cerca de la autopista. Beneficiada por el boom del e-commerce."
  },
  "Storage Units": {
    name: "Mini bodegas",
    description: "Complejo de 50 mini bodegas de bajo mantenimiento."
  },
  "Mobile Home Park": {
    name: "Parque de casas móviles",
    description: "Parque de 25 lotes con ingresos por arrendamiento de terreno."
  },
  "Foreclosure House": {
    name: "Casa en ejecución hipotecaria",
    description: "Propiedad recuperada por el banco. Necesita trabajo pero está en excelente ubicación."
  },
  "Fixer-Upper": {
    name: "Propiedad para remodelar",
    description: "Propiedad en problemas. Precio bajo y alto potencial."
  },
  "Estate Sale House": {
    name: "Casa de venta por herencia",
    description: "Propiedad heredada con vendedor motivado. Negocio rápido."
  },
  "Tax Lien Property": {
    name: "Propiedad por adeudo de impuestos",
    description: "Comprada en subasta fiscal. Flujo positivo inmediato."
  },
  "Beachfront Condo": {
    name: "Condominio frente al mar",
    description: "Condominio de lujo con vista al océano. Zona turística codiciada."
  },
  "Mountain Cabin": {
    name: "Cabaña en la montaña",
    description: "Renta en resort de esquí. Ingresos altos en temporada."
  },
  "Downtown Loft": {
    name: "Loft en el centro",
    description: "Loft moderno en barrio de moda. Profesionales jóvenes lo aman."
  },
  "MYT4U Tech Stock": {
    name: "Acción tecnológica MYT4U",
    description: "Startup tecnológica en crecimiento. Alto riesgo, alta recompensa."
  },
  "GRO4US Software": {
    name: "Software GRO4US",
    description: "Empresa de software estable con dividendos."
  },
  "OK4U Systems": {
    name: "OK4U Systems",
    description: "Compañía de servicios TI estable con dividendos confiables."
  },
  "TechFlow Inc": {
    name: "TechFlow Inc.",
    description: "Pionera en computación en la nube. Aún sin dividendos."
  },
  "DataMine Corp": {
    name: "DataMine Corp.",
    description: "Empresa de analítica de datos en un sector en crecimiento."
  },
  "BigCo Industries": {
    name: "BigCo Industries",
    description: "Corporación Fortune 500 con dividendos constantes."
  },
  "MegaCorp Global": {
    name: "MegaCorp Global",
    description: "Conglomerado internacional con rendimientos confiables."
  },
  "Utility Power Co": {
    name: "Utility Power Co.",
    description: "Compañía eléctrica. Aburrida pero estable."
  },
  "DividendKing Inc": {
    name: "DividendKing Inc.",
    description: "REIT de alto dividendo con pagos consistentes."
  },
  "Income Trust": {
    name: "Income Trust",
    description: "Acción de alto rendimiento con 6% anual."
  },
  "RocketStart Inc": {
    name: "RocketStart Inc.",
    description: "Empresa de hipercrecimiento. Volátil pero prometedora."
  },
  "BioTech Pharma": {
    name: "BioTech Pharma",
    description: "Farmacéutica con aprobaciones de la FDA pendientes."
  },
  "GreenEnergy Corp": {
    name: "GreenEnergy Corp.",
    description: "Líder en energía renovable con subsidios gubernamentales."
  },
  "Penny Gold Mining": {
    name: "Penny Gold Mining",
    description: "Acción minera especulativa. Riesgo alto."
  },
  "StartupVenture Co": {
    name: "StartupVenture Co.",
    description: "Nueva OPI. Podría ser el próximo gran éxito… o no."
  },
  "Car Wash": {
    name: "Autolavado",
    description: "Autolavado automatizado con bajo mantenimiento e ingreso constante."
  },
  "Laundromat": {
    name: "Lavandería",
    description: "Lavandería autoservicio en vecindario denso. Negocio de efectivo."
  },
  "Vending Machine Route": {
    name: "Ruta de máquinas expendedoras",
    description: "20 máquinas en edificios corporativos. Ingreso pasivo."
  },
  "ATM Business": {
    name: "Negocio de cajeros ATM",
    description: "10 cajeros en zonas de alto tráfico."
  },
  "Food Truck": {
    name: "Food truck",
    description: "Camión de comida popular con ruta establecida."
  },
  "Franchise Restaurant": {
    name: "Restaurante franquiciado",
    description: "Franquicia de comida rápida con marca reconocida."
  },
  "Gas Station": {
    name: "Gasolinera",
    description: "Gasolinera con tienda 24/7."
  },
  "Fitness Center": {
    name: "Gimnasio",
    description: "Gimnasio pequeño con 200 miembros e ingresos recurrentes."
  },
  "Online Store": {
    name: "Tienda en línea",
    description: "Negocio de e-commerce con modelo de dropshipping."
  },
  "Rental Car Fleet": {
    name: "Flota de autos de renta",
    description: "15 vehículos listos para rentas en aeropuerto."
  },
  "Oil Drilling Partnership": {
    name: "Sociedad de perforación petrolera",
    description: "Proyecto petrolero especulativo en Texas. Alto riesgo, alto retorno."
  },
  "Real Estate Syndication": {
    name: "Sindicatura inmobiliaria",
    description: "Inversión colectiva en propiedad comercial."
  },
  "Private Equity Fund": {
    name: "Fondo de private equity",
    description: "Participación limitada en fondo de startups con bloqueo de 5 años."
  },
  "Wind Farm Investment": {
    name: "Inversión en parque eólico",
    description: "Proyecto de energía verde con beneficios fiscales."
  },
  "Movie Production": {
    name: "Producción cinematográfica",
    description: "Financiamiento para película independiente. Podría ser un éxito."
  },
  "Beachfront Resort Condo": {
    name: "Condominio resort frente al mar",
    description: "Condominio premium en destino turístico con tarifas altas en temporada."
  },
  "Penthouse Suite": {
    name: "Penthouse de lujo",
    description: "Último piso en torre del centro. Clientela ejecutiva."
  },
  "Mountain Resort Lodge": {
    name: "Lodge en resort de montaña",
    description: "Propiedad con 6 unidades en centro de esquí. Mina de oro en invierno."
  },
  "50-Unit Apartment Complex": {
    name: "Complejo de 50 unidades",
    description: "Gran complejo con alberca, gimnasio y estacionamiento."
  },
  "75-Unit Student Housing": {
    name: "Residencias estudiantiles de 75 unidades",
    description: "Departamentos para estudiantes cerca de una universidad. Ocupación garantizada."
  },
  "100-Unit High-Rise": {
    name: "Torre residencial de 100 unidades",
    description: "Rascacielos en el centro con rentas premium."
  },
  "Shopping Center": {
    name: "Centro comercial",
    description: "Centro suburbano con 15 locales y un inquilino ancla."
  },
  "Office Tower": {
    name: "Torre de oficinas",
    description: "Edificio corporativo de 10 pisos con múltiples arrendatarios."
  },
  "Industrial Park": {
    name: "Parque industrial",
    description: "Conjunto de bodegas para el auge del e-commerce."
  },
  "Hotel Property": {
    name: "Hotel de 120 habitaciones",
    description: "Hotel consolidado cerca del aeropuerto."
  },
  "Restaurant Chain (5 locations)": {
    name: "Cadena de restaurantes (5 sedes)",
    description: "Franquicia establecida con cinco ubicaciones rentables."
  },
  "Car Dealership": {
    name: "Concesionaria de autos",
    description: "Agencia con taller de servicio y base de clientes fiel."
  },
  "Manufacturing Business": {
    name: "Empresa manufacturera",
    description: "Planta con contratos vigentes y equipo incluido."
  },
  "Distribution Company": {
    name: "Empresa distribuidora",
    description: "Mayorista con flotilla y almacenes."
  },
  "Tech Startup (Exit)": {
    name: "Startup tecnológica (exit)",
    description: "Compra total de startup exitosa con producto probado y crecimiento."
  },
  "Apartment Management Co": {
    name: "Administradora de departamentos",
    description: "Firma que gestiona más de 500 unidades con ingresos recurrentes."
  },
  "Medical Practice": {
    name: "Consultorio médico",
    description: "Práctica dental con tres doctores y cartera de pacientes."
  },
  "Construction Company": {
    name: "Empresa constructora",
    description: "Contratista general con proyectos en cartera."
  },
  "Logistics Company": {
    name: "Empresa logística",
    description: "Transporte y logística con 20 camiones y contratos."
  },
  "Solar Installation Co": {
    name: "Empresa de instalación solar",
    description: "Negocio en expansión con incentivos gubernamentales."
  },
  "Blue Chip Portfolio": {
    name: "Portafolio blue chip",
    description: "Cartera diversificada de empresas Fortune 500 con fuertes dividendos."
  },
  "REIT Portfolio": {
    name: "Portafolio REIT",
    description: "Cartera de fideicomisos inmobiliarios comerciales."
  },
  "Dividend Aristocrats": {
    name: "Aristócratas del dividendo",
    description: "Empresas con más de 25 años incrementando dividendos."
  },
  "Tech Giant Stock": {
    name: "Acción de gigante tecnológico",
    description: "Acción de gran empresa tech con crecimiento y dividendos."
  },
  "International Fund": {
    name: "Fondo internacional",
    description: "Fondo de mercados emergentes con alto potencial."
  },
  "Commercial Development": {
    name: "Desarrollo comercial",
    description: "Proyecto de nuevo centro comercial con horizonte de 5 años."
  },
  "Tech Venture Capital": {
    name: "Fondo de capital de riesgo",
    description: "Fondo VC que invierte en startups. Riesgo alto, recompensa enorme."
  },
  "Hotel Development": {
    name: "Desarrollo hotelero",
    description: "Construcción de hotel que abrirá en dos años."
  },
  "Renewable Energy Farm": {
    name: "Parque de energía renovable",
    description: "Inversión en granja solar/eólica con contratos gubernamentales."
  },
  "Medical Real Estate": {
    name: "Desarrollo inmobiliario médico",
    description: "Edificio de consultorios con contratos de largo plazo."
  }
}

const marketCardTranslations: Record<string, TranslationEntry> = {
  "Stock Split 2:1": {
    name: "Split de acciones 2:1",
    description: "Tu acción se divide dos por uno. ¡Duplica tus títulos!"
  },
  "Stock Market Boom": {
    name: "Boom bursátil",
    description: "La bolsa se dispara y los precios suben."
  },
  "Market Correction": {
    name: "Corrección de mercado",
    description: "La bolsa cae y los precios bajan."
  },
  "Downsized!": {
    name: "Despido masivo",
    description: "Perdiste tu empleo. Pierdes dos turnos de salario."
  },
  "Baby Born!": {
    name: "¡Bebé en camino!",
    description: "Felicidades, tu familia crece y también tus gastos."
  },
  "Charity Donation": {
    name: "Donación a caridad",
    description: "Dona 10% de tu ingreso y reduce impuestos durante tres turnos."
  },
  "Paycheck Day": {
    name: "Día de pago extra",
    description: "Recibes tu ingreso mensual completo."
  }
}

export function translateOpportunityCard<T extends CardWithText>(card: T): T {
  if (!card || !card.name) {
    return card
  }

  const translation = opportunityCardTranslations[card.name]
  if (!translation) {
    return card
  }

  return {
    ...card,
    name: translation.name,
    description: translation.description
  }
}

export function translateMarketEvent<T extends CardWithText>(event: T): T {
  if (!event || !event.name) {
    return event
  }

  const translation = marketCardTranslations[event.name]
  if (!translation) {
    return event
  }

  return {
    ...event,
    name: translation.name,
    description: translation.description
  }
}

