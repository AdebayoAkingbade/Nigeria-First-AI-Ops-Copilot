import Image from "next/image";
import { cn } from "@/lib/utils";

type KudiPalLogoProps = {
    className?: string;
    compact?: boolean;
    imageClassName?: string;
    panelClassName?: string;
    subtitleClassName?: string;
    showSubtitle?: boolean;
    subtitle?: string;
};

export function KudiPalLogo({
    className,
    compact = false,
    imageClassName,
    panelClassName,
    subtitleClassName,
    showSubtitle = false,
    subtitle = "Friendly money insights via chat",
}: KudiPalLogoProps) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className={cn("w-fit", panelClassName)}>
                <Image
                    src="/images/kudi_logo.png"
                    alt="KudiPal"
                    width={1536}
                    height={1024}
                    className={cn(
                        "h-auto w-[170px]",
                        compact && "w-[132px]",
                        imageClassName
                    )}
                />
            </div>
            {showSubtitle ? (
                <p
                    className={cn(
                        "text-sm leading-none text-slate-500",
                        compact && "text-xs",
                        subtitleClassName
                    )}
                >
                    {subtitle}
                </p>
            ) : null}
        </div>
    );
}
