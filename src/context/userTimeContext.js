// src/hooks/useTimerContext.js
import { useContext } from "react";
import TimerContext from "../context/TimerContext";

export function useTimerContext() {
    const context = useContext(TimerContext);

    if (context === undefined) {
        throw new Error(
            "useTimerContext debe ser usado dentro de un TimerProvider"
        );
    }

    return context;
}
