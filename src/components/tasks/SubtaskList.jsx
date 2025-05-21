import { useState } from 'react';
import { useTaskContext } from '../../hooks/useTaskContext';
import SubtaskTimer from './SubtaskTimer';

const SubtaskList = ({ taskId, subtasks }) => {
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const { addSubtask, deleteSubtask, toggleSubtaskCompletion, updateSubtaskTime } = useTaskContext();

    const handleAddSubtask = (e) => {
        e.preventDefault();
        if (newSubtaskTitle.trim()) {
            addSubtask(taskId, newSubtaskTitle);
            setNewSubtaskTitle('');
        }
    };

    // Función para formatear el tiempo en minutos
    const formatTime = (minutes) => {
        return `${minutes} min`;
    };

    return (
        <div className="subtask-container">
            {/* Mostrar las subtareas existentes */}
            {subtasks.length > 0 ? (
                <ul className="subtask-list">
                    {subtasks.map((subtask) => (
                        <li key={subtask.id} className="subtask-item">
                            <div className="subtask-content">
                                <input
                                    type="checkbox"
                                    checked={subtask.completed}
                                    onChange={() => toggleSubtaskCompletion(taskId, subtask.id)}
                                />
                                <span className={subtask.completed ? 'completed' : ''}>
                                    {subtask.title}
                                </span>
                            </div>
                            
                            <div className="subtask-actions">
                                <div className="subtask-controls-group">
                                    {/* Temporizador con botones + y - */}
                                    <div className="timer-controls">
                                        <button 
                                            onClick={() => updateSubtaskTime(taskId, subtask.id, -5)}
                                            className="timer-btn decrease"
                                            aria-label="Disminuir tiempo"
                                            disabled={subtask.timerRunning}
                                        >
                                            -
                                        </button>
                                        
                                        <span className="timer-display">
                                            {formatTime(subtask.estimatedTime || 0)}
                                        </span>
                                        
                                        <button 
                                            onClick={() => updateSubtaskTime(taskId, subtask.id, 5)}
                                            className="timer-btn increase"
                                            aria-label="Aumentar tiempo"
                                            disabled={subtask.timerRunning}
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    {/* Componente de temporizador con botón de empezar/detener */}
                                    <SubtaskTimer taskId={taskId} subtask={subtask} />
                                </div>
                                
                                <button 
                                    onClick={() => deleteSubtask(taskId, subtask.id)}
                                    className="delete-subtask-btn"
                                    disabled={subtask.timerRunning}
                                >
                                    eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-subtasks">No hay subtareas</p>
            )}

            {/* Formulario para añadir nuevas subtareas (solo si hay menos de 4) */}
            {subtasks.length < 4 && (
                <form onSubmit={handleAddSubtask} className="add-subtask-form">
                    <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="Añadir subtarea"
                        className="subtask-input"
                    />
                    <button type="submit" className="add-subtask-btn">
                        Añadir
                    </button>
                </form>
            )}

            {/* Mensaje cuando se alcanza el límite de subtareas */}
            {subtasks.length >= 4 && (
                <p className="subtask-limit-message">
                    Límite de 4 subtareas alcanzado
                </p>
            )}
        </div>
    );
};

export default SubtaskList;
