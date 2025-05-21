import "./App.css";
import { TaskProvider } from "./context/TaskContext";
import { useTaskContext } from "./hooks/useTaskContext";
import TaskInput from "./components/tasks/TaskInput";
import TaskList from "./components/tasks/TaskList";
import ActiveTaskTimer from "./components/tasks/ActiveTaskTimer";

function App() {
    return (
        <TaskProvider>
            <AppContent />
        </TaskProvider>
    );
}

// Componente interno para acceder al contexto
function AppContent() {
    const { activeTimer } = useTaskContext();
    
    return (
        <div className="app-container">
            <h1>TDAHLIST</h1>
            <ActiveTaskTimer />
            {/* Solo mostrar el input cuando no hay temporizador activo */}
            {!activeTimer && <TaskInput />}
            <TaskList />
        </div>
    );
}

export default App;
