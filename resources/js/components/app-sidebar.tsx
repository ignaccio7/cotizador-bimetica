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
                {/* Sección Comercial & Ventas (Vendedor) */}
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

                <SidebarSeparator className="my-2 border-dashed opacity-60" />

                {/* Sección Administración & Catálogo (Admin) */}
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
            </SidebarContent>

            <SidebarFooter className="p-2 border-t border-sidebar-border/40">
                {/* Switcher rápido de Roles para pruebas en vistas */}
                <div className="mb-2 rounded-lg bg-muted/60 p-2 text-xs border border-border/50">
                    <div className="flex items-center justify-between font-medium text-muted-foreground mb-1.5">
                        <span>Vista activa:</span>
                        <span className="font-semibold text-primary uppercase text-[10px] px-1.5 py-0.5 rounded bg-primary/10">
                            {userRole === 'admin' ? 'Administrador' : 'Vendedor'}
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        <a
                            href="/dev-login/seller"
                            className={`flex-1 text-center py-1 rounded text-[11px] font-medium transition-colors ${
                                userRole === 'seller'
                                    ? 'bg-[#fbad03] text-primary-950 font-bold shadow-xs'
                                    : 'bg-background hover:bg-muted text-muted-foreground'
                            }`}
                        >
                            Vendedor
                        </a>
                        <a
                            href="/dev-login/admin"
                            className={`flex-1 text-center py-1 rounded text-[11px] font-medium transition-colors ${
                                userRole === 'admin'
                                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                                    : 'bg-background hover:bg-muted text-muted-foreground'
                            }`}
                        >
                            Admin
                        </a>
                    </div>
                </div>

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
