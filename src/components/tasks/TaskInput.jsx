import { useState } from "react"; // useState viene de React
import { useTaskContext } from "../../hooks/useTaskContext"; // Solo importamos useTaskContext

const TaskInput = () => {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("media");
    const { addTask } = useTaskContext();

    // handleSubmit debe estar dentro del componente
    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            addTask(title, priority);
            setTitle("");
            setPriority("media");
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="introduce una tarea"
                    ></input>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="baja">baja</option>
                        <option value="media">media</option>
                        <option value="alta">alta</option>
                    </select>
                </div>
            </form>
        </>
    );
};

export default TaskInput;
