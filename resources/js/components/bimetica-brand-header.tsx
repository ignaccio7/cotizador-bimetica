import { Link } from '@inertiajs/react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';

export function BimeticaBrandHeader() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    asChild
                    tooltip={{ children: 'BIMETICA — Diseño y Construcción' }}
                    className="h-12 w-full overflow-hidden rounded-lg bg-[#071526] p-0 text-white transition-all duration-150 hover:bg-[#0b1c33] hover:text-white data-[state=open]:hover:bg-[#0b1c33] group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!"
                >
                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex size-full items-center gap-2.5 px-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
                    >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white p-1 shadow-xs transition-transform group-hover:scale-105 group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:p-0.5">
                            <img
                                src="/b_logo.png"
                                alt="Bimetica"
                                className="size-full object-contain"
                            />
                        </div>
                        <div className="flex min-w-0 flex-col text-left leading-none truncate group-data-[collapsible=icon]:hidden">
                            <span className="text-[14px] font-black tracking-widest text-white">
                                BIMETICA
                            </span>
                            <span className="mt-1 text-[8.5px] font-bold tracking-wider text-[#6bb6d9]">
                                DISEÑO Y CONSTRUCCIÓN
                            </span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
