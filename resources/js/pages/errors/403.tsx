import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, ArrowLeft, DraftingCompass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Forbidden({ message }: { message?: string }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 text-white">
            <Head title="403 - Acceso Denegado | BIMETICA" />

            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl backdrop-blur-md">
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <ShieldAlert className="size-9 text-[#fbad03]" />
                </div>

                <div className="mb-2 flex items-center justify-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded bg-[#fbad03] text-slate-950 font-black">
                        <DraftingCompass className="size-4" />
                    </div>
                    <span className="font-extrabold tracking-wider text-sm text-slate-200">BIMETICA</span>
                </div>

                <h1 className="text-4xl font-black tracking-tight text-white mb-2">403</h1>
                <h2 className="text-lg font-semibold text-slate-300 mb-3">Acceso Denegado</h2>

                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    {message || 'No tienes los permisos necesarios para acceder a esta sección del sistema.'}
                </p>

                <div className="flex flex-col gap-2">
                    <Button asChild className="w-full bg-[#003e65] hover:bg-[#00253d] text-white font-semibold">
                        <Link href="/">
                            <ArrowLeft className="mr-2 size-4" />
                            Volver a mi panel principal
                        </Link>
                    </Button>
                </div>
            </div>

            <p className="mt-8 text-xs text-slate-500">
                BIMETICA DISEÑO Y CONSTRUCCIÓN S.R.L. &copy; {new Date().getFullYear()}
            </p>
        </div>
    );
}
