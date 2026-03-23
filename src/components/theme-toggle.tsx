'use client'

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-border/70 bg-secondary/70 text-foreground hover:bg-secondary transition-colors rounded-full"
            aria-label="Toggle color mode"
            onClick={toggleTheme}
        >
            <Sun className={`h-5 w-5 ${theme === "dark" ? "hidden" : "block"}`} />
            <Moon className={`h-5 w-5 ${theme === "dark" ? "block" : "hidden"}`} />
        </Button>
    );
}
