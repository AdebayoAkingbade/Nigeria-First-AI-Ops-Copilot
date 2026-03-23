'use client'

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const applyThemeClass = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");

    // Initialize from localStorage or system preference
    useEffect(() => {
        const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as Theme | null;
        const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
        setThemeState(initial);
        applyThemeClass(initial);
    }, []);

    const setTheme = (next: Theme) => {
        setThemeState(next);
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", next);
            applyThemeClass(next);
        }
    };

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
};
