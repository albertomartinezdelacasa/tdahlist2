import "./App.css";
import { TaskProvider } from "./context/TaskContext";
import TaskInput from "./components/tasks/TaskInput";
import TaskList from "./components/tasks/TaskList";

function App() {
    return (
        <TaskProvider>
            <div>
                <h1>TDALIST</h1>
                <TaskInput></TaskInput>
                <TaskList />
            </div>
        </TaskProvider>
    );
}

export default App;
