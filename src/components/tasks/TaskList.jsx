import { useTaskContext } from "../../hooks/useTaskContext";

const TaskList = () => {
    const { tasks, toogleTaskCompletion, deleteTask } = useTaskContext();
    if (tasks.length === 0) {
        return <p>no hay tareas</p>;
    }
    return (
        <>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <div>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toogleTaskCompletion(task.id)}
                            ></input>
                            <span>{task.priority}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};
export default TaskList;
