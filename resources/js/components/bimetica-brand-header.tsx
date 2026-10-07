import { Link } from '@inertiajs/react';
import { BadgeCheck, DraftingCompass } from 'lucide-react';
import quotes from '@/routes/quotes';

export function BimeticaBrandHeader() {
    return (
        <Link
            href={quotes.index()}
            prefetch
            className="group/bimetica flex w-full items-center justify-between overflow-hidden rounded-lg bg-[#071526] p-3 text-white shadow-md transition-all duration-150 hover:bg-[#0b1c33]"
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#fbad03] text-[#003e65] shadow-xs transition-transform group-hover/bimetica:scale-105">
                    <DraftingCompass className="size-5 stroke-[2.2]" />
                </div>
                <div className="flex flex-col text-left leading-none truncate">
                    <span className="text-[15px] font-black tracking-widest text-white">
                        BIMETICA
                    </span>
                    <span className="mt-1 text-[9px] font-bold tracking-wider text-[#6bb6d9]">
                        DISEÑO Y CONSTRUCCIÓN
                    </span>
                </div>
            </div>
            <div className="flex shrink-0 items-center justify-center pl-1">
                <BadgeCheck className="size-5 text-[#38bdf8]" />
            </div>
        </Link>
    );
}
