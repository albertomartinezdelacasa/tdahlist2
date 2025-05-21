import {
    createContext,
    useState,
    useEffect,
    useCallback
} from "react";
import { v4 as uuidv4 } from "uuid";

const TaskContext = createContext();

export function TaskProvider({ children }) {
    // ESTADO PARA ALMACENAR TAREAS
    const [tasks, setTasks] = useState([]);
    // ESTADO PARA LA COLA DE TEMPORIZADORES
    const [timerQueue, setTimerQueue] = useState([]);
    // ESTADO PARA EL TEMPORIZADOR ACTIVO
    const [activeTimer, setActiveTimer] = useState(null);

    // CARGAR TAREAS DEL LOCALSTORAGE - si se recarga la página no se pierden
    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
        
        // También cargar la cola de temporizadores si existe
        const savedQueue = localStorage.getItem("timerQueue");
        if (savedQueue) {
            setTimerQueue(JSON.parse(savedQueue));
        }
        
        // Y el temporizador activo
        const savedActiveTimer = localStorage.getItem("activeTimer");
        if (savedActiveTimer) {
            setActiveTimer(JSON.parse(savedActiveTimer));
        }
    }, []);

    // Guardar tareas en localStorage
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);
    
    // Guardar cola de temporizadores en localStorage
    useEffect(() => {
        localStorage.setItem("timerQueue", JSON.stringify(timerQueue));
    }, [timerQueue]);
    
    // Guardar temporizador activo en localStorage
    useEffect(() => {
        localStorage.setItem("activeTimer", JSON.stringify(activeTimer));
    }, [activeTimer]);

    // Añadir una nueva tarea
    const addTask = (title, priority = "media") => {
        const newTask = {
            id: uuidv4(),
            title,
            priority,
            completed: false,
            subtasks: [],
            totalEstimatedTime: 0, // almacena el tiempo total estimado
            totalCompletedTime: 0, // tiempo utilizado
            isExpanded: true, // estado de visualización de la tarea en la interfaz de usuario
        };
        setTasks([...tasks, newTask]);
    };

    // Eliminar tarea
    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    // Marcar una tarea como completada
    const toggleTaskCompletion = (taskId) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            )
        );
    };

    // Editar una tarea
    const editTask = (taskId, updatedTask) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, ...updatedTask } : task
            )
        );
    };

    // Añadir una subtarea a una tarea
    const addSubtask = (taskId, subtaskTitle) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === taskId) {
                    // Limitar a 4 subtareas
                    if (task.subtasks.length >= 4) {
                        return task;
                    }
                    
                    const newSubtask = {
                        id: uuidv4(),
                        parentId: taskId,
                        title: subtaskTitle,
                        completed: false,
                        estimatedTime: 0,
                        completedTime: 0,
                        order: task.subtasks.length + 1
                    };
                    
                    return {
                        ...task,
                        subtasks: [...task.subtasks, newSubtask]
                    };
                }
                return task;
            })
        );
    };

    // Eliminar una subtarea
    const deleteSubtask = (taskId, subtaskId) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        subtasks: task.subtasks.filter(
                            (subtask) => subtask.id !== subtaskId
                        )
                    };
                }
                return task;
            })
        );
    };

    // Marcar una subtarea como completada
    const toggleSubtaskCompletion = (taskId, subtaskId) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        subtasks: task.subtasks.map((subtask) =>
                            subtask.id === subtaskId
                                ? { ...subtask, completed: !subtask.completed }
                                : subtask
                        )
                    };
                }
                return task;
            })
        );
    };
    
    // Actualizar el tiempo estimado de una subtarea
    const updateSubtaskTime = (taskId, subtaskId, minutes) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        subtasks: task.subtasks.map((subtask) => {
                            if (subtask.id === subtaskId) {
                                // Asegurarse de que el tiempo no sea negativo
                                const newTime = Math.max(0, (subtask.estimatedTime || 0) + minutes);
                                return { ...subtask, estimatedTime: newTime };
                            }
                            return subtask;
                        })
                    };
                }
                return task;
            })
        );
    };
    
    // Procesar el siguiente temporizador en la cola
    const processNextTimer = useCallback(() => {
        if (timerQueue.length > 0) {
            // Obtener el siguiente temporizador de la cola
            const nextTimer = timerQueue[0];
            const newQueue = timerQueue.slice(1);
            setTimerQueue(newQueue);
            
            // Establecer el nuevo temporizador activo
            setActiveTimer(nextTimer);
            
            // Activar el temporizador en la tarea
            setTasks(
                tasks.map((task) => {
                    if (task.id === nextTimer.taskId) {
                        return {
                            ...task,
                            subtasks: task.subtasks.map((subtask) => {
                                if (subtask.id === nextTimer.subtaskId) {
                                    return { 
                                        ...subtask, 
                                        timerRunning: true,
                                        timerStartTime: new Date().getTime(),
                                        remainingTime: (subtask.estimatedTime || 0) * 60 // Convertir a segundos
                                    };
                                }
                                return subtask;
                            })
                        };
                    }
                    return task;
                })
            );
        } else {
            // No hay más temporizadores en la cola
            setActiveTimer(null);
        }
    }, [timerQueue, tasks]);
    
    // Efecto para procesar el siguiente temporizador cuando el activo termina
    useEffect(() => {
        if (activeTimer === null && timerQueue.length > 0) {
            processNextTimer();
        }
    }, [activeTimer, timerQueue, processNextTimer]);

    // Iniciar el temporizador de una subtarea
    const startSubtaskTimer = useCallback((taskId, subtaskId) => {
        // Crear el objeto de temporizador
        const timerInfo = { taskId, subtaskId };
        
        // Si no hay temporizador activo, iniciar este inmediatamente
        if (activeTimer === null) {
            setActiveTimer(timerInfo);
            
            // Activar el temporizador en la tarea
            setTasks(
                tasks.map((task) => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            subtasks: task.subtasks.map((subtask) => {
                                if (subtask.id === subtaskId) {
                                    return { 
                                        ...subtask, 
                                        timerRunning: true,
                                        timerStartTime: new Date().getTime(),
                                        remainingTime: (subtask.estimatedTime || 0) * 60 // Convertir a segundos
                                    };
                                }
                                return subtask;
                            })
                        };
                    }
                    return task;
                })
            );
        } else {
            // Ya hay un temporizador activo, añadir a la cola
            setTimerQueue([...timerQueue, timerInfo]);
            
            // Mostrar un mensaje al usuario
            alert(`La subtarea se ha añadido a la cola. Posición: ${timerQueue.length + 1}`);
        }
    }, [activeTimer, timerQueue, tasks]);
    
    // Iniciar todas las subtareas de una tarea
    const startAllSubtasks = useCallback((taskId) => {
        // Buscar la tarea
        const task = tasks.find(t => t.id === taskId);
        if (!task || task.subtasks.length === 0) {
            alert('No hay subtareas para iniciar');
            return;
        }
        
        // Filtrar subtareas con tiempo estimado > 0 y que no estén completadas
        const validSubtasks = task.subtasks.filter(
            subtask => subtask.estimatedTime > 0 && !subtask.completed
        );
        
        if (validSubtasks.length === 0) {
            alert('No hay subtareas válidas para iniciar. Asegúrate de que tengan tiempo estimado y no estén completadas.');
            return;
        }
        
        // Iniciar la primera subtarea
        if (validSubtasks.length > 0) {
            startSubtaskTimer(taskId, validSubtasks[0].id);
        }
        
        // Añadir el resto a la cola
        for (let i = 1; i < validSubtasks.length; i++) {
            setTimerQueue(prev => [...prev, { taskId, subtaskId: validSubtasks[i].id }]);
        }
        
        // Mostrar mensaje de confirmación
        if (validSubtasks.length > 1) {
            alert(`Se han añadido ${validSubtasks.length} subtareas a la cola.`);
        }
    }, [tasks, startSubtaskTimer]);
    
    // Detener el temporizador de una subtarea
    const stopSubtaskTimer = useCallback((taskId, subtaskId) => {
        // Desactivar el temporizador en la tarea
        setTasks(
            tasks.map((task) => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        subtasks: task.subtasks.map((subtask) => {
                            if (subtask.id === subtaskId) {
                                return { 
                                    ...subtask, 
                                    timerRunning: false,
                                    completedTime: (subtask.completedTime || 0) + 
                                        ((subtask.estimatedTime || 0) - (subtask.remainingTime || 0) / 60)
                                };
                            }
                            return subtask;
                        })
                    };
                }
                return task;
            })
        );
        
        // Limpiar el temporizador activo
        setActiveTimer(null);
        
        // Procesar el siguiente temporizador en la cola si existe
        if (timerQueue.length > 0) {
            setTimeout(() => {
                processNextTimer();
            }, 1000); // Pequeño retraso para permitir que la UI se actualice
        }
    }, [tasks, timerQueue, processNextTimer]);

    const value = {
        tasks,
        addTask,
        deleteTask,
        toggleTaskCompletion,
        editTask,
        addSubtask,
        deleteSubtask,
        toggleSubtaskCompletion,
        updateSubtaskTime,
        startSubtaskTimer,
        stopSubtaskTimer,
        startAllSubtasks,
        timerQueue,
        activeTimer
    };
    
    return (
        <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
    );
}

export default TaskContext;
