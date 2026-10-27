import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/30 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <div className="flex items-center justify-center mb-1">
                            <img
                                src="/bimetica_logo.png"
                                alt="Bimetica — Diseño y Construcción"
                                className="h-12 w-auto object-contain dark:hidden"
                            />
                            <img
                                src="/bimetica_logo_blanco.png"
                                alt="Bimetica — Diseño y Construcción"
                                className="h-12 w-auto object-contain hidden dark:block"
                            />
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight text-foreground">
                                {title}
                            </h1>
                            {description && (
                                <p className="text-xs text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
