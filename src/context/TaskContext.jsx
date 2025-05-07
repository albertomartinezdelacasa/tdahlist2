// const [state, dispatch] = useReducer(reducer, initialState);

import { createContext, useReducer } from "react";
import { appState,taskModel,userSettingsModel } from "../utils/models";

const TaskContext = createContext();

const initialState = {
    ...appState,
    tasks:[],
};


const tasksReducer = (state, action) =>{
    switch(action.type){
        case: 'ADD_TASK':
        const newTask = {
            ...taskModel,
            id: uuidv4(),                     // Generar ID único real
            title: action.payload.title,      // Datos del usuario
            description: action.payload.description || "",
            priority: action.payload.priority || "media",
            completed: false,                 // Valores por defecto
            subtasks: [],
            totalEstimatedTime: action.payload.totalEstimatedTime || 0,
            totalCompletedTime: 0,
            isExpanded: true,
            createdAt: new Date().toISOString()
          };

          return {
            ...state,
            tasks: [...state.tasks, newTask],
            activeTask: newTask.id  // Opcionalmente establecer como tarea activa
          };
          default:
            return state;
    }

}


const addTaskAction ={
    type: 'ADD_TASK',
    payload: {
        title: "Mi nueva tarea",
        description: "Descripción detallada",  // proporcionada por el usuario
        priority: "alta",
    }
}


const [state, dispatch] = useReducer(reducer, initialState);

