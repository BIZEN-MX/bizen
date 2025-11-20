// Billy Tour Configuration
// Define all tour steps with selectors, titles, and content

export type BillyTourStep = {
  id: string;
  selector: string; // CSS selector to find the target element
  title: string;
  body: string;
  image?: string; // Image URL for this step
  placement?: "top" | "bottom" | "left" | "right" | "auto";
};

export const BILLY_TOUR_STEPS: BillyTourStep[] = [
  {
    id: "courses",
    selector: '[data-bizen-tour="courses"]',
    title: "Courses (Cursos)",
    body: "Aquí es donde aprendo todos los temas de BIZEN. Cada curso tiene unidades y lecciones cortas, con actividades, preguntas y retos. Todo está organizado para avanzar paso a paso y ganar XP.",
    image: "/rightmenucourses.png",
    placement: "auto"
  },
  {
    id: "business-lab",
    selector: '[data-bizen-tour="business-lab"]',
    title: "Business-Lab",
    body: "Es un espacio para empezar mi emprendimiento, guiándome de la mano paso a paso para convertirme en todo un emprendedor.",
    image: "/rightmenubusinesslab.png",
    placement: "auto"
  },
  {
    id: "cashflow",
    selector: '[data-bizen-tour="cashflow"]',
    title: "Cashflow",
    body: "Es una simulación donde controlo ingresos, gastos y decisiones del día a día. Me ayuda a entender cómo se mueve el dinero, cómo planear y cómo evitar errores financieros. Es como un juego de flujo de efectivo.",
    image: "/rightmenucashflow.png",
    placement: "auto"
  },
  {
    id: "simuladores",
    selector: '[data-bizen-tour="simuladores"]',
    title: "Simuladores",
    body: "Aquí encuentro mini-simulaciones interactivas más específicas: ahorrar, invertir, usar crédito, manejar un presupuesto, etc. Cada simulador me enseña un concepto financiero con práctica real, pero rápida y divertida.",
    image: "/rightmenusimulators.png",
    placement: "auto"
  },
  {
    id: "progreso",
    selector: '[data-bizen-tour="progreso"]',
    title: "Mi Progreso",
    body: "Es un resumen claro de todo lo que llevo avanzado: cursos completados, XP acumulado, racha, logros, lecciones pendientes, nivel actual y lo que me falta para subir.",
    image: "/rightmenuprogress.png",
    placement: "auto"
  },
  {
    id: "foro",
    selector: '[data-bizen-tour="foro"]',
    title: "Foro",
    body: "Es un espacio para preguntar, compartir ideas y aprender con otros. Aquí puedo pedir ayuda, resolver dudas y entrar a conversaciones sobre emprendimiento, finanzas, proyectos y retos.",
    image: "/rightmenuforo.png",
    placement: "auto"
  },
  {
    id: "profile",
    selector: '[data-bizen-tour="profile"]',
    title: "Profile (Perfil)",
    body: "Aquí veo mis datos, mis insignias, mis niveles, mi avatar y mis estadísticas. Todo lo que dice quién soy dentro de BIZEN.",
    placement: "auto"
  },
  {
    id: "configuracion",
    selector: '[data-bizen-tour="configuracion"]',
    title: "Configuración",
    body: "En esta sección ajusto cosas importantes de mi cuenta: idioma, notificaciones, accesibilidad, preferencias, modo oscuro y opciones generales de la app.",
    image: "/rightmenusettings.png",
    placement: "auto"
  }
];

// Local storage key for tracking if tour has been seen
export const BILLY_TOUR_LOCAL_STORAGE_KEY = "bizen_onboarding_v2_seen";

