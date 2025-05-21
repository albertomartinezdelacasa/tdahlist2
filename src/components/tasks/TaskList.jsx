import { useState } from "react";
import { useTaskContext } from "../../hooks/useTaskContext";
import SubtaskList from "./SubtaskList";

const TaskList = () => {
    const { tasks, toggleTaskCompletion, deleteTask, startAllSubtasks, activeTimer } = useTaskContext();
    const [expandedTasks, setExpandedTasks] = useState({});

    if (tasks.length === 0) {
        return <p>No hay tareas</p>;
    }

    const toggleTaskExpand = (taskId) => {
        setExpandedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <li key={task.id} className="task-item">
                    <div className="task-header">
                        <div className="task-main-info">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTaskCompletion(task.id)}
                                className="task-checkbox"
                            />
                            <span className={task.completed ? "completed" : ""}>
                                {task.title}
                            </span>
                            <span className={`priority ${task.priority}`}>
                                {task.priority}
                            </span>
                        </div>
                        <div className="task-actions">
                            <button 
                                onClick={() => toggleTaskExpand(task.id)}
                                className="expand-btn"
                            >
                                {expandedTasks[task.id] ? "Ocultar" : "Mostrar"} subtareas
                            </button>
                            
                            {task.subtasks.length > 0 && !activeTimer && (
                                <button 
                                    onClick={() => startAllSubtasks(task.id)}
                                    className="start-all-btn"
                                    title="Inicia todas las subtareas en secuencia"
                                >
                                    Empezar todas
                                </button>
                            )}
                            
                            <button 
                                onClick={() => deleteTask(task.id)}
                                className="delete-btn"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                    
                    {/* Mostrar subtareas si la tarea está expandida */}
                    {expandedTasks[task.id] && (
                        <div className="subtasks-section">
                            <h4>Subtareas ({task.subtasks.length}/4)</h4>
                            <SubtaskList 
                                taskId={task.id} 
                                subtasks={task.subtasks} 
                            />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default TaskList;
