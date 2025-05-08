import { useContext } from "react";
import TaskContext from "../context/TaskContext";

export function useTaskContext() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error("useTaskContext no funciona");
    }
    return context;
}
