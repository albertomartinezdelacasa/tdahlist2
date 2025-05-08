// const [state, dispatch] = useReducer(reducer, initialState);

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useReducer,
} from "react";
import { appState, taskModel, userSettingsModel } from "../utils/models";
import { v4 as uuidv4 } from "uuid";

const TaskContext = createContext();
//resto del codigo del contexto

export function TaskProvider({ children }) {
    //ESTADO PARA ALMACENAR TAREAS
    const [tasks, setTasks] = useState([]);

    //CARGAR TAREAS DEL LOCALSTORGE- si se recarga la pagina no se pierden

    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    //añadir  una nueva tarea

    const addTask = (title, priority = "media") => {
        const newTask = {
            id: uuidv4(),
            title,
            priority,
            completed: false,
            subtasks: [],
            totalEstimatedTime: 0, //almacena el tiempo total estimado.
            totalCompletedTime: 0, //tiempoutilizado
            isExpanded: true, //estado de visualización de la tarea en la interfaz de usuario.
        };
        setTasks([...tasks, newTask]);
    };
    //eliminar tarea

    const deleteTask = (taskId) => {
        setTasks(tasks.filter((task) => task.id != taskId));
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

    const editTask = (taskId, updatedTask) => {
        setTasks(
            tasks.map((task) =>
                task.id === taskId ? { ...task, ...updatedTask } : task
            )
        );
    };

    const value = {
        tasks,
        addTask,
        deleteTask,
        toggleTaskCompletion,
        editTask,
    };
    return (
        <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
    );
}

export default TaskContext;
