// src/context/TimerContext.jsx
import { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// Crear el contexto
const TimerContext = createContext();

// Proveedor del contexto
export function TimerProvider({ children }) {
    // Estados principales del temporizador
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(25 * 60); // 25 minutos en segundos por defecto
    const [initialTime, setInitialTime] = useState(25 * 60); // Para reiniciar
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [timerType, setTimerType] = useState("focus"); // focus, shortBreak, longBreak

    // Historial de sesiones
    const [sessions, setSessions] = useState([]);

    // Configuración del temporizador
    const [settings, setSettings] = useState({
        focusDuration: 25, // minutos
        shortBreakDuration: 5,
        longBreakDuration: 15,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        sessionsBeforeLongBreak: 4,
    });

    // Contador para sesiones completadas
    const [sessionCount, setSessionCount] = useState(0);

    // Efecto para manejar el contador
    useEffect(() => {
        let interval = null;

        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (isRunning && time === 0) {
            // Cuando el temporizador llega a cero
            setIsRunning(false);
            handleTimerComplete();
        }

        return () => clearInterval(interval);
    }, [isRunning, time]);

    // Cargar settings desde localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem("timerSettings");
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    // Guardar settings en localStorage
    useEffect(() => {
        localStorage.setItem("timerSettings", JSON.stringify(settings));
    }, [settings]);

    // Cargar sesiones desde localStorage
    useEffect(() => {
        const savedSessions = localStorage.getItem("timerSessions");
        if (savedSessions) {
            setSessions(JSON.parse(savedSessions));
        }
    }, []);

    // Guardar sesiones en localStorage
    useEffect(() => {
        localStorage.setItem("timerSessions", JSON.stringify(sessions));
    }, [sessions]);

    // Función para manejar cuando se completa un temporizador
    const handleTimerComplete = () => {
        // Guardar la sesión completada
        const newSession = {
            id: uuidv4(),
            taskId: activeTaskId,
            duration: initialTime,
            type: timerType,
            completedAt: new Date().toISOString(),
        };

        setSessions([...sessions, newSession]);

        // Incrementar contador de sesiones
        const newCount = sessionCount + 1;
        setSessionCount(newCount);

        // Determinar el siguiente tipo de temporizador
        if (timerType === "focus") {
            // Después de una sesión de concentración, pasar a un descanso
            if (newCount % settings.sessionsBeforeLongBreak === 0) {
                // Descanso largo después de X sesiones
                changeTimerType("longBreak");
            } else {
                // Descanso corto después de cada sesión
                changeTimerType("shortBreak");
            }

            // Iniciar automáticamente el descanso si está configurado
            if (settings.autoStartBreaks) {
                setTimeout(() => startTimer(), 1000);
            }
        } else {
            // Después de un descanso, volver a modo focus
            changeTimerType("focus");

            // Iniciar automáticamente el siguiente pomodoro si está configurado
            if (settings.autoStartPomodoros) {
                setTimeout(() => startTimer(), 1000);
            }
        }
    };

    // Funciones para controlar el temporizador
    const startTimer = (taskId = null) => {
        setIsRunning(true);
        if (taskId && taskId !== activeTaskId) {
            setActiveTaskId(taskId);
        }
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTime(initialTime);
    };

    const changeTimerType = (type) => {
        setTimerType(type);

        // Ajustar duración según el tipo
        let newDuration;

        switch (type) {
            case "focus":
                newDuration = settings.focusDuration;
                break;
            case "shortBreak":
                newDuration = settings.shortBreakDuration;
                break;
            case "longBreak":
                newDuration = settings.longBreakDuration;
                break;
            default:
                newDuration = settings.focusDuration;
        }

        setTime(newDuration * 60);
        setInitialTime(newDuration * 60);
    };

    const updateSettings = (newSettings) => {
        setSettings({ ...settings, ...newSettings });

        // Si hay un cambio en la duración del tipo actual, actualizar el tiempo
        if (
            (timerType === "focus" && newSettings.focusDuration) ||
            (timerType === "shortBreak" && newSettings.shortBreakDuration) ||
            (timerType === "longBreak" && newSettings.longBreakDuration)
        ) {
            changeTimerType(timerType);
        }
    };

    // Valor del contexto que exponemos
    const value = {
        isRunning,
        time,
        timerType,
        activeTaskId,
        sessions,
        settings,
        sessionCount,
        startTimer,
        pauseTimer,
        resetTimer,
        changeTimerType,
        updateSettings,
    };

    return (
        <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
    );
}

export default TimerContext;
