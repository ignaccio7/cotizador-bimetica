import { Link, usePage } from '@inertiajs/react';
import {
    Calculator,
    CirclePlus,
    Contact,
    FilePenLine,
    FileSpreadsheet,
    FileText,
    Globe,
    Layers,
    Receipt,
    ScrollText,
    ShieldCheck,
    Sliders,
    Users,
} from 'lucide-react';
import { BimeticaBrandHeader } from '@/components/bimetica-brand-header';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import admin from '@/routes/admin';
import clientsRoute from '@/routes/clients';
import contractsRoute from '@/routes/contracts';
import designationsRoute from '@/routes/designations';
import initialFormsRoute from '@/routes/initial-forms';
import quotesRoute from '@/routes/quotes';
import type { User } from '@/types';

export function AppSidebar() {
    const { isCurrentUrl } = useCurrentUrl();
    const { auth } = usePage<{ auth?: { user?: User } }>().props;
    const userRole = auth?.user?.role || 'seller';

    const commercialNavItems = [
        {
            title: 'Nueva Cotización',
            href: quotesRoute.create(),
            icon: CirclePlus,
        },
        {
            title: 'Mis Cotizaciones',
            href: quotesRoute.index(),
            icon: FileSpreadsheet,
        },
        {
            title: 'Formulario Inicial',
            href: initialFormsRoute.index(),
            icon: FilePenLine,
        },
        {
            title: 'Contratos',
            href: contractsRoute.index(),
            icon: ScrollText,
        },
        {
            title: 'Designación Proyectista',
            href: designationsRoute.index(),
            icon: Contact,
        },
        {
            title: 'Clientes & Historial',
            href: clientsRoute.index(),
            icon: Users,
        },
    ];

    const adminNavItems = [
        {
            title: 'Servicios & Fórmulas',
            href: admin.services.index(),
            icon: Calculator,
        },
        {
            title: 'Variables del Sistema',
            href: admin.variables.index(),
            icon: Sliders,
        },
        {
            title: 'Parámetros Globales',
            href: admin.parameters.index(),
            icon: Globe,
        },
        {
            title: 'Plantillas de Contrato',
            href: admin.contractTemplates.index(),
            icon: FileText,
        },
        {
            title: 'Gestión de Usuarios',
            href: admin.users.index(),
            icon: ShieldCheck,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="p-2">
                <BimeticaBrandHeader />
            </SidebarHeader>

            <SidebarContent className="px-1">
                {/* Sección Comercial & Ventas (Visible para Vendedor y Admin) */}
                <SidebarGroup className="py-1">
                    <SidebarGroupLabel className="flex items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wider text-[#b8860b] dark:text-[#fbad03]">
                        <Receipt className="size-4 shrink-0 text-[#b8860b] dark:text-[#fbad03]" />
                        <span>COMERCIAL & VENTAS</span>
                    </SidebarGroupLabel>
                    <SidebarMenu className="mt-1 space-y-0.5">
                        {commercialNavItems.map((item) => {
                            const active = isCurrentUrl(item.href);
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={{ children: item.title }}
                                        className="h-9 font-medium text-foreground/80 hover:bg-secondary/15 hover:text-foreground data-[active=true]:bg-secondary/20 data-[active=true]:font-semibold data-[active=true]:text-secondary-800 dark:data-[active=true]:text-secondary-300"
                                    >
                                        <Link href={item.href} prefetch>
                                            <item.icon className="size-4 shrink-0" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Sección Administración & Catálogo (ESTRICTAMENTE ADMIN) */}
                {userRole === 'admin' && (
                    <>
                        <SidebarSeparator className="my-2 border-dashed opacity-60" />

                        <SidebarGroup className="py-1">
                            <SidebarGroupLabel className="flex items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wider text-tertiary-700 dark:text-tertiary-300">
                                <Layers className="size-4 shrink-0 text-tertiary-600 dark:text-tertiary-400" />
                                <span>ADMINISTRACIÓN & CATÁLOGO</span>
                            </SidebarGroupLabel>
                            <SidebarMenu className="mt-1 space-y-0.5">
                                {adminNavItems.map((item) => {
                                    const active = isCurrentUrl(item.href);
                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={active}
                                                tooltip={{ children: item.title }}
                                                className="h-9 font-medium text-foreground/80 hover:bg-tertiary/15 hover:text-foreground data-[active=true]:bg-tertiary/20 data-[active=true]:font-semibold data-[active=true]:text-tertiary-800 dark:data-[active=true]:text-tertiary-300"
                                            >
                                                <Link href={item.href} prefetch>
                                                    <item.icon className="size-4 shrink-0" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroup>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="p-2 border-t border-sidebar-border/40">
                {/* Indicador de Motor AEC */}
                <div className="mb-2 flex items-center justify-between rounded-lg border border-border/40 bg-muted/40 px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-[#fbad03] shadow-[0_0_8px_#fbad03]" />
                        <span className="tracking-wider font-semibold">MOTOR CÁLCULO AEC V2.4</span>
                    </div>
                    <span className="font-bold text-foreground text-[9px] uppercase tracking-wider px-1 rounded bg-secondary/15 text-secondary-800 dark:text-secondary-300">
                        ACTIVO
                    </span>
                </div>


                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
