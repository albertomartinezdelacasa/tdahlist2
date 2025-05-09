import { useTaskContext } from "../../hooks/useTaskContext";

const TaskList = () => {
    const { tasks, toggleTaskCompletion, deleteTask } = useTaskContext();
    if (tasks.length === 0) {
        return <p>no hay tareas</p>;
    }
    return (
        <ul>
            {tasks.map((task) => (
                <li key={task.id}>
                    <div>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTaskCompletion(task.id)}
                        ></input>
                        {task.title}
                        <span>{task.priority}</span>
                    </div>
                    <div>
                        <button onClick={() => deleteTask(task.id)}>
                            eliminar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};
export default TaskList;
