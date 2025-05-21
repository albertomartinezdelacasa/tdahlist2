import { useEffect, useState } from 'react';
import { useTaskContext } from '../../hooks/useTaskContext';

const ActiveTaskTimer = () => {
    const { tasks, stopSubtaskTimer, timerQueue, activeTimer } = useTaskContext();
    const [activeTask, setActiveTask] = useState(null);
    const [activeSubtask, setActiveSubtask] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [queuedTasks, setQueuedTasks] = useState([]);
    
    // Buscar la tarea y subtarea activa
    useEffect(() => {
        if (!activeTimer) {
            setActiveTask(null);
            setActiveSubtask(null);
            return;
        }
        
        const { taskId, subtaskId } = activeTimer;
        
        // Buscar la tarea activa
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        // Buscar la subtarea activa
        const subtask = task.subtasks.find(s => s.id === subtaskId);
        if (!subtask) return;
        
        setActiveTask(task);
        setActiveSubtask(subtask);
    }, [activeTimer, tasks]);
    
    // Buscar las tareas en cola
    useEffect(() => {
        const queued = [];
        
        // Para cada temporizador en la cola, buscar la tarea y subtarea correspondiente
        for (const timer of timerQueue) {
            const task = tasks.find(t => t.id === timer.taskId);
            if (!task) continue;
            
            const subtask = task.subtasks.find(s => s.id === timer.subtaskId);
            if (!subtask) continue;
            
            queued.push({
                taskTitle: task.title,
                subtaskTitle: subtask.title,
                estimatedTime: subtask.estimatedTime || 0
            });
        }
        
        setQueuedTasks(queued);
    }, [timerQueue, tasks]);
    
    // Actualizar el tiempo restante
    useEffect(() => {
        if (!activeSubtask) return;
        
        // Establecer el tiempo inicial
        setTimeLeft(activeSubtask.remainingTime || activeSubtask.estimatedTime * 60);
        
        // Crear un intervalo para actualizar el tiempo
        const intervalId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(intervalId);
    }, [activeSubtask]);
    
    // Formatear el tiempo en formato mm:ss
    const formatTimeDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Si no hay tarea activa, mostrar mensaje de que no hay temporizadores activos
    if (!activeTask || !activeSubtask) {
        if (queuedTasks.length > 0) {
            return (
                <div className="active-task-timer inactive">
                    <div className="queue-info">
                        <h3>Cola de temporizadores</h3>
                        <p>No hay temporizador activo. {queuedTasks.length} en cola.</p>
                        <ul className="queue-list">
                            {queuedTasks.map((item, index) => (
                                <li key={index} className="queue-item">
                                    <span className="queue-position">{index + 1}</span>
                                    <div className="queue-task-info">
                                        <div className="queue-task-title">{item.taskTitle}</div>
                                        <div className="queue-subtask-title">{item.subtaskTitle}</div>
                                    </div>
                                    <div className="queue-time">{item.estimatedTime} min</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }
        return null;
    }
    
    return (
        <div className="active-task-timer">
            <div className="active-task-info">
                <div className="active-task-title">
                    <span className="label">Tarea:</span> {activeTask.title}
                </div>
                <div className="active-subtask-title">
                    <span className="label">Subtarea:</span> {activeSubtask.title}
                </div>
                {queuedTasks.length > 0 && (
                    <div className="queue-count">
                        <span className="label">En cola:</span> {queuedTasks.length}
                    </div>
                )}
            </div>
            
            <div className="active-timer">
                <div className="countdown-display">
                    {formatTimeDisplay(timeLeft)}
                </div>
                <button 
                    className="stop-timer-btn"
                    onClick={() => stopSubtaskTimer(activeTask.id, activeSubtask.id)}
                >
                    Detener
                </button>
            </div>
            
            {queuedTasks.length > 0 && (
                <div className="queue-preview">
                    <h4>Próximos temporizadores</h4>
                    <ul className="queue-list-mini">
                        {queuedTasks.slice(0, 3).map((item, index) => (
                            <li key={index} className="queue-item-mini">
                                <span className="queue-position-mini">{index + 1}</span>
                                <span className="queue-title-mini">{item.subtaskTitle}</span>
                            </li>
                        ))}
                        {queuedTasks.length > 3 && (
                            <li className="queue-more">+{queuedTasks.length - 3} más</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ActiveTaskTimer;
