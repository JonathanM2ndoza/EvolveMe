export const es = {
  // Onboarding Component
  onboarding: {
    welcomeTitle: 'Bienvenido a EvolveMe',
    welcomeSubtitle: 'Tu guía de superación personal impulsada por IA.',
    getStarted: 'Empecemos',
    ageTitle: '¿Cuántos años tienes?',
    agePlaceholder: 'Ingresa tu edad',
    continue: 'Continuar',
    back: 'Atrás',
    ageDisclaimer: 'Debes tener 13 años o más para usar este servicio.',
    genderTitle: '¿Cuál es tu género?',
    genders: {
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro'
    },
    goalTitle: '¿Cuál es tu objetivo principal?',
    goals: {
      Skincare: 'Cuidado de la Piel',
      Fitness: 'Fitness',
      Style: 'Estilo',
      Confidence: 'Confianza'
    },
    selfieTitle: 'Tu Primer Análisis',
    selfieSubtitle: 'Vamos a establecer una línea de base. Tómate un selfie para tu evaluación inicial.',
    finalizeTitle: 'Analizando...',
    finalizeSubtitle: 'Estamos creando tu plan personalizado. Esto puede tomar un momento.',
    viewDashboard: 'Ver Mi Panel',
    language: 'English'
  },

  // Dashboard Component
  dashboard: {
    headerTitle: 'Tu Panel',
    headerSubtitle: 'Bienvenido de nuevo, evolucionemos juntos.',
    scoreLabel: 'Puntaje Evolve',
    analyzeSelfie: 'Nueva Evaluación',
    resetProfile: 'Reiniciar Perfil',
    currentGoal: 'Tu Objetivo Actual:',
    changeGoal: 'Cambiar Objetivo',
    cancel: 'Cancelar',
    selectNewGoal: 'Selecciona tu nuevo objetivo principal:',
    scoreProgression: 'Progresión de Puntaje',
    timeframes: {
      day: 'Día',
      week: 'Semana',
      month: 'Mes',
      year: 'Año'
    },
    notEnoughData: "No hay suficientes datos para mostrar el gráfico.",
    notEnoughDataSubtitle: "Analiza al menos dos selfies para ver tu progreso.",
    progressHistory: 'Historial de Progreso',
    analyzing: 'Analizando tu selfie con IA... Esto puede tomar un momento.',
    noHistory: 'Aún no has analizado ninguna selfie.',
    noHistorySubtitle: '¡Haz clic en "Nueva Evaluación" para obtener tu primer puntaje y consejos!',
    selfieFrom: 'Selfie de usuario de',
    selfAssessment: 'Autoevaluación',
    recommendations: 'Recomendaciones',
    aiTips: 'Consejos Personalizados de IA',
    disclaimer: 'Descargo de responsabilidad: Estos consejos son solo para fines informativos y no sustituyen el consejo médico profesional. Consulta siempre a un proveedor de atención médica calificado para cualquier inquietud médica.',
    resetConfirmation: '¿Estás seguro de que quieres reiniciar tu perfil y empezar de nuevo?',
    deleteRecordTitle: 'Eliminar Registro',
    deleteConfirmation: '¿Estás seguro de que quieres eliminar este registro permanentemente? Esta acción no se puede deshacer.',
    confirmDelete: 'Eliminar'
  },

  // Selfie Analyzer Component
  selfie: {
    title: 'Analizar Selfie',
    errorTitle: 'Error',
    errorPermission: 'Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador.',
    errorAccess: 'No se pudo acceder a la cámara. Asegúrate de que no esté siendo utilizada por otra aplicación.',
    errorUnknown: 'Ocurrió un error desconocido al acceder a la cámara.',
    errorNoSupport: 'Tu navegador no es compatible con el acceso a la cámara.',
    capture: 'Capturar y Analizar',
    bestResults: 'Centra tu rostro en el marco para obtener los mejores resultados.'
  },

  // Terms & Conditions
  terms: {
    trigger: 'Términos y Condiciones',
    title: 'Descargo de Responsabilidad sobre la Información de Salud',
    close: 'Cerrar',
    content: `Todo el contenido proporcionado en la aplicación [EvolveMe], incluyendo textos, gráficos, imágenes y cualquier otro material, se ofrece únicamente con fines informativos y educativos.
Este contenido no ha sido diseñado para sustituir, y no sustituye, la consulta, el diagnóstico o el tratamiento médico profesional. La confianza depositada en cualquier información proporcionada por esta aplicación es únicamente bajo su propio riesgo.
[EvolveMe] no ofrece consejo médico. Le recomendamos encarecidamente que busque el consejo de su médico u otro proveedor de salud calificado con cualquier pregunta que pueda tener con respecto a una condición médica o tratamiento.
No retrase ni ignore la búsqueda de consejo médico profesional debido a la información obtenida a través de esta aplicación. En caso de emergencia médica, llame a su médico o a los servicios de emergencia locales de inmediato.`
  },

  // Gemini Service Prompts
  prompts: {
    advice: "Eres un experto coach de bienestar y superación personal. Tu consejo debe ser altamente personalizado. Un usuario, que es un(a) {gender} de {age} años, tiene el objetivo principal de mejorar en '{goal}'. Proporciona 5 consejos prácticos y fáciles de seguir, específicamente adaptados a su edad y al objetivo indicado. Por ejemplo, el consejo sobre el cuidado de la piel para un adolescente debe ser diferente al de una persona de 40 años. Presenta los consejos como una lista numerada que comience con \"1.\". Cada consejo debe ser conciso (1-2 frases). No añadas párrafos introductorios ni de conclusión, solo la lista. Responde en {language}.",
    selfieAnalysis: "Eres un analista de belleza y bienestar de IA. Tu análisis debe ser personalizado y constructivo. Basado en esta selfie de un(a) {gender} de {age} años cuyo objetivo principal es '{goal}', proporciona una puntuación numérica del 1 al 100, una breve autoevaluación y una lista de 2-3 recomendaciones prácticas. Las recomendaciones deben ser altamente relevantes para su edad y objetivo específico. Sé alentador y objetivo. La puntuación debe basarse en factores visibles relevantes para el objetivo (ej. para Cuidado de la Piel, observa la claridad de la piel y si es apropiado para la edad; para Estilo, el aseo y si la elección de moda es adecuada a su contexto). Responde en {language}."
  }
};