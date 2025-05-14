// src/context/DarkModeContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

interface DarkModeContextProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextProps>({
    darkMode: false,
    toggleDarkMode: () => { },
});

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("dark-mode");
        if (stored === "true") setDarkMode(true);
    }, []);

    useEffect(() => {
        localStorage.setItem("dark-mode", darkMode.toString());
    }, [darkMode]);

    // inside DarkModeProvider (after localStorage logic)

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [darkMode]);


    const toggleDarkMode = () => setDarkMode((prev) => !prev);

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
