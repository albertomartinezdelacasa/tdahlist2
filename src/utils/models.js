import { title } from "framer-motion/client";
import { v4 as uuidv4 } from "uuid";

// - **taskModel**: Define una tarea principal con propiedades como título, descripción, estado de completado, prioridad, fechas, etiquetas, y una lista de subtareas.

const taskModel = {
    id: "uuid-generado",
    title: "completar proyecto",
    descripcion: "",
    priority: ["baja", "media", "urgente"],
    completed: false,
    subtasks: [],
    totalEstimadedTime: 120,
    totalCompletedTime: 0,
    isExpanded: true,
};
// - **subtaskModel**: Define cómo se estructura cada subtarea, incluyendo propiedades como título, tiempo estimado, estado de completado, y relación con la tarea principal.

const subtaskModel = {
    id: "uuid-generado", // Identificador único
    parentId: "uuid-de-tarea-padre", // ID de la tarea padre
    title: "Investigar frameworks", // Título de la subtarea
    description: "", // Descripción opcional
    completed: false, // Estado de completado
    estimatedTime: 30, // Tiempo estimado en minutos
    completedTime: 0, // Tiempo real completado
    order: 1, // Orden dentro de la lista de subtareas
    children: [], // Posibles sub-subtareas (para subdivisión)
    inProgress: false, // Si está actualmente en progreso
    timeSessions: [], // Historial de sesiones de tiempo
};

// - **timerModel**: Define cómo funciona un temporizador, con propiedades para duración, tipo (concentración o descanso), estado actual, etc.
const timerModel = {
    id: "uuid-generado", // Identificador único
    taskId: "uuid-de-tarea", // ID de la tarea/subtarea relacionada
    duration: 25, // Duración en minutos (25 por defecto - pomodoro)
    type: "focus", // Tipo: focus, break, longBreak
    completed: false, // Si se ha completado
    startTime: "2025-05-06T10:15:00Z", // Hora de inicio
    endTime: "2025-05-06T10:40:00Z", // Hora de finalización
    pausedTime: 0, // Tiempo acumulado en pausas (en segundos)
    currentStatus: "idle", // Estado: idle, running, paused, completed
};
// - **timeSessionModel**: Registra las sesiones de tiempo completadas para hacer seguimiento estadístico.
const timeSessionModel = {
    id: "uuid-generado", // Identificador único
    taskId: "uuid-de-tarea", // ID de la tarea/subtarea relacionada
    startTime: "2025-05-06T10:15:00Z", // Hora de inicio
    endTime: "2025-05-06T10:40:00Z", // Hora de finalización
    duration: 1500, // Duración en segundos (25 min = 1500 seg)
    completed: true, // Si se completó o se canceló
};
// - **userSettingsModel**: Almacena todas las preferencias del usuario como duración de pomodoros, ajustes de sonido, temas visuales, etc.
const userSettingsModel = {
    id: "uuid-generado", // Identificador único
    focusDuration: 25, // Duración de sesiones de concentración (minutos)
    shortBreakDuration: 5, // Duración de descansos cortos (minutos)
    longBreakDuration: 15, // Duración de descansos largos (minutos)
    sessionsBeforeLongBreak: 4, // Sesiones antes de un descanso largo
    autoStartBreaks: false, // Comenzar descansos automáticamente
    autoStartPomodoros: false, // Comenzar pomodoros automáticamente
    notifications: true, // Habilitar notificaciones
    soundEnabled: true, // Habilitar sonidos
    soundVolume: 80, // Volumen (0-100)
    colorTheme: "light", // Tema: light, dark, auto
    highContrastMode: false, // Modo de alto contraste para accesibilidad
    useDefaultSubtaskDivision: true, // Usar división en 4 por defecto
    defaultPriority: "medium", // Prioridad por defecto para nuevas tareas
    animations: "reduced", // Animaciones: full, reduced, none
};
// - **appState**: Representa el estado global de la aplicación, combinando todos los modelos anteriores.

const appState = {
    tasks: [], // Lista de tareas principales
    activeTask: null, // Tarea actualmente activa
    activeSubtask: null, // Subtarea actualmente activa
    activeTimer: null, // Temporizador actualmente activo
    currentSession: null, // Sesión de tiempo actual
    settings: userSettingsModel, // Ajustes del usuario
    statistics: {}, // Estadísticas de uso
    filters: {
        showCompleted: true,
        priorityFilter: "all",
        tagFilter: [],
        searchTerm: "",
    },
    notifications: [], // Notificaciones pendientes
};
export {
    taskModel,
    subtaskModel,
    timerModel,
    timeSessionModel,
    userSettingsModel,
    appState,
};
