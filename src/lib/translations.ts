export const translations = {
  es: {
    // Common
    common: {
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      back: "← Volver",
      logout: "Cerrar Sesión",
      loggingOut: "Cerrando...",
      continue: "Continuar",
      start: "Comenzar",
      complete: "Completar",
      locked: "Bloqueada",
      unlocked: "Desbloqueada",
      completed: "Completado"
    },
    
    // Navigation
    nav: {
      exploreCourses: "Explorar Cursos",
      assignments: "Asignaciones",
      myProgress: "Mi Progreso",
      businessLab: "Business Lab",
      profile: "Perfil",
      account: "Cuenta",
      settings: "Configuración",
      dashboard: "Dashboard"
    },
    
    // Courses Page
    courses: {
      title: "Camino de Aprendizaje",
      loadingPath: "Cargando camino de aprendizaje...",
      course: "CURSO",
      lessons: "lecciones",
      hours: "horas",
      levels: {
        beginner: "Principiante",
        intermediate: "Intermedio",
        advanced: "Avanzado",
        courses: "Cursos"
      },
      progress: {
        yourProgress: "Tu Progreso",
        coursesCompleted: "Cursos completados"
      },
      lesson: "Lección",
      completeLesson: "Completa la lección anterior",
      review: "Revisar →",
      begin: "Comenzar →"
    },
    
    // Assignments Page
    assignments: {
      title: "Mis Asignaciones",
      subtitle: "Tareas y actividades pendientes",
      noPending: "No tienes asignaciones pendientes",
      allCaughtUp: "¡Estás al día!",
      dueDate: "Fecha límite",
      status: "Estado",
      pending: "Pendiente",
      inProgress: "En progreso",
      completed: "Completado",
      viewDetails: "Ver Detalles"
    },
    
    // Progress Page
    progress: {
      title: "Mi Progreso",
      subtitle: "Rastrea tu aprendizaje",
      stats: {
        coursesEnrolled: "Cursos Inscritos",
        lessonsCompleted: "Lecciones Completadas",
        currentStreak: "Racha Actual",
        totalPoints: "Puntos Totales",
        days: "días"
      },
      recentActivity: "Actividad Reciente",
      achievements: "Logros",
      performance: "Rendimiento"
    },
    
    // Profile Page
    profile: {
      title: "Mi Perfil",
      editProfile: "Editar Perfil",
      personalInfo: "Información Personal",
      fullName: "Nombre Completo",
      email: "Correo Electrónico",
      phone: "Teléfono",
      bio: "Biografía",
      saveChanges: "Guardar Cambios",
      changePassword: "Cambiar Contraseña",
      currentPassword: "Contraseña Actual",
      newPassword: "Nueva Contraseña",
      confirmPassword: "Confirmar Contraseña"
    },
    
    // Dashboard Page
    dashboard: {
      welcome: "¡Bienvenido de nuevo",
      continueWhere: "Continúa donde lo dejaste",
      recentCourses: "Cursos Recientes",
      upcomingDeadlines: "Próximas Fechas Límite",
      quickStats: "Estadísticas Rápidas"
    },
    
    // Sidebar Stats
    sidebar: {
      hello: "¡Hola",
      student: "Estudiante",
      yourProgress: "Tu Progreso",
      courses: "Cursos",
      lessons: "Lecciones",
      streak: "Racha",
      points: "Puntos",
      quickActions: "Acciones Rápidas"
    }
  },
  
  en: {
    // Common
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      back: "← Back",
      logout: "Logout",
      loggingOut: "Logging out...",
      continue: "Continue",
      start: "Start",
      complete: "Complete",
      locked: "Locked",
      unlocked: "Unlocked",
      completed: "Completed"
    },
    
    // Navigation
    nav: {
      exploreCourses: "Explore Courses",
      assignments: "Assignments",
      myProgress: "My Progress",
      businessLab: "Business Lab",
      profile: "Profile",
      account: "Account",
      settings: "Settings",
      dashboard: "Dashboard"
    },
    
    // Courses Page
    courses: {
      title: "Learning Path",
      loadingPath: "Loading learning path...",
      course: "COURSE",
      lessons: "lessons",
      hours: "hours",
      levels: {
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
        courses: "Courses"
      },
      progress: {
        yourProgress: "Your Progress",
        coursesCompleted: "Courses completed"
      },
      lesson: "Lesson",
      completeLesson: "Complete previous lesson",
      review: "Review →",
      begin: "Begin →"
    },
    
    // Assignments Page
    assignments: {
      title: "My Assignments",
      subtitle: "Pending tasks and activities",
      noPending: "You have no pending assignments",
      allCaughtUp: "You're all caught up!",
      dueDate: "Due Date",
      status: "Status",
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      viewDetails: "View Details"
    },
    
    // Progress Page
    progress: {
      title: "My Progress",
      subtitle: "Track your learning",
      stats: {
        coursesEnrolled: "Courses Enrolled",
        lessonsCompleted: "Lessons Completed",
        currentStreak: "Current Streak",
        totalPoints: "Total Points",
        days: "days"
      },
      recentActivity: "Recent Activity",
      achievements: "Achievements",
      performance: "Performance"
    },
    
    // Profile Page
    profile: {
      title: "My Profile",
      editProfile: "Edit Profile",
      personalInfo: "Personal Information",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      bio: "Bio",
      saveChanges: "Save Changes",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password"
    },
    
    // Dashboard Page
    dashboard: {
      welcome: "Welcome back",
      continueWhere: "Continue where you left off",
      recentCourses: "Recent Courses",
      upcomingDeadlines: "Upcoming Deadlines",
      quickStats: "Quick Stats"
    },
    
    // Sidebar Stats
    sidebar: {
      hello: "Hello",
      student: "Student",
      yourProgress: "Your Progress",
      courses: "Courses",
      lessons: "Lessons",
      streak: "Streak",
      points: "Points",
      quickActions: "Quick Actions"
    }
  }
}

export function useTranslation(language: 'es' | 'en') {
  return translations[language]
}



