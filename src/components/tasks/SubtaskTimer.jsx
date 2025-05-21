import { useState, useEffect, useCallback } from 'react';
import { useTaskContext } from '../../hooks/useTaskContext';

const SubtaskTimer = ({ taskId, subtask }) => {
    const { startSubtaskTimer, stopSubtaskTimer } = useTaskContext();
    const [timeLeft, setTimeLeft] = useState(subtask.remainingTime || subtask.estimatedTime * 60);
    const [intervalId, setIntervalId] = useState(null);

    // Formatear el tiempo en formato mm:ss
    const formatTimeDisplay = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Iniciar el temporizador - usando useCallback para evitar recreaciones
    const handleStart = useCallback(() => {
        if (subtask.estimatedTime <= 0) {
            alert('Establece un tiempo estimado antes de empezar');
            return;
        }
        
        startSubtaskTimer(taskId, subtask.id);
        
        // Iniciar el intervalo para actualizar el tiempo restante
        const newIntervalId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(newIntervalId);
                    stopSubtaskTimer(taskId, subtask.id);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        setIntervalId(newIntervalId);
    }, [taskId, subtask.id, subtask.estimatedTime, startSubtaskTimer, stopSubtaskTimer]);

    // Detener el temporizador - usando useCallback para evitar recreaciones
    const handleStop = useCallback(() => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        stopSubtaskTimer(taskId, subtask.id);
    }, [intervalId, taskId, subtask.id, stopSubtaskTimer]);

    // Actualizar el tiempo restante cuando cambia el estado del temporizador
    useEffect(() => {
        if (subtask.timerRunning && !intervalId) {
            setTimeLeft(subtask.remainingTime || subtask.estimatedTime * 60);
            handleStart();
        } else if (!subtask.timerRunning && intervalId) {
            handleStop();
        }
        
        // Limpiar el intervalo cuando el componente se desmonta
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [
        subtask.timerRunning, 
        intervalId, 
        subtask.remainingTime, 
        subtask.estimatedTime, 
        handleStart, 
        handleStop, 
        taskId, 
        subtask.id
    ]);

    return (
        <div className="subtask-timer">
            {subtask.timerRunning && (
                <div className="active-timer-info">
                    <span className="active-subtask-title">{subtask.title}</span>
                    <div className="timer-countdown">
                        {formatTimeDisplay(timeLeft)}
                    </div>
                </div>
            )}
            
            {!subtask.timerRunning ? (
                <div className="timer-controls-wrapper">
                    <div className="timer-countdown">
                        {formatTimeDisplay(timeLeft)}
                    </div>
                    <button 
                        onClick={handleStart}
                        className="timer-start-btn"
                        disabled={subtask.estimatedTime <= 0}
                    >
                        Empezar
                    </button>
                </div>
            ) : (
                <button 
                    onClick={handleStop}
                    className="timer-stop-btn"
                >
                    Detener
                </button>
            )}
        </div>
    );
};

export default SubtaskTimer;
