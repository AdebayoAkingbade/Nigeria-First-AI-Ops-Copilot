import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
    currentStep: number;
}

export function Stepper({ currentStep }: StepperProps) {
    const steps = [
        { id: 1, name: "Account Setup" },
        { id: 2, name: "Business Info" },
        { id: 3, name: "Upload Data" },
    ];

    return (
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-40 py-4 border-b md:border-none md:bg-transparent">
            <div className="flex items-center justify-center w-full max-w-3xl mx-auto px-4">
                {steps.map((step, index) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.id} className="flex items-center flex-1 last:flex-none">

                            {/* Step Circle & Text */}
                            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                                <div
                                    className={cn(
                                        "h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                                        isCompleted
                                            ? "bg-green-500 text-white"
                                            : isActive
                                                ? "bg-primary text-white"
                                                : "bg-gray-200 text-gray-500"
                                    )}
                                >
                                    {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                                </div>
                                <span
                                    className={cn(
                                        "text-sm font-semibold hidden md:block",
                                        isActive ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {step.name}
                                </span>
                            </div>

                            {/* Connecting Line */}
                            {!isLast && (
                                <div className="flex-1 mx-2 md:mx-4 h-[2px] bg-gray-200">
                                    <div
                                        className={cn(
                                            "h-full bg-green-500 transition-all duration-500",
                                            isCompleted ? "w-full" : "w-0"
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
