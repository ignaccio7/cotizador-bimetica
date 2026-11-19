import { usePage } from '@inertiajs/react';
import {
    Calculator,
    FilePlus,
    FileSpreadsheet,
    LayoutGrid,
    Sliders,
    SlidersHorizontal,
    Settings,
    Users,
} from 'lucide-react';
import { BimeticaBrandHeader } from '@/components/bimetica-brand-header';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import configurations from '@/routes/configurations';
import parameters from '@/routes/parameters';
import quotes from '@/routes/quotes';
import services from '@/routes/services';
import users from '@/routes/users';
import variables from '@/routes/variables';
import type { Auth, NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const isAdmin = auth?.user?.role === 'admin';

    const commercialNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: 'Cotizaciones',
            href: quotes.index(),
            icon: FileSpreadsheet,
        },
        {
            title: 'Nueva Cotización',
            href: quotes.create(),
            icon: FilePlus,
        },
    ];

    const adminNavItems: NavItem[] = [
        {
            title: 'Servicios & Fórmulas',
            href: services.index(),
            icon: Calculator,
        },
        {
            title: 'Variables del Sistema',
            href: variables.index(),
            icon: Sliders,
        },
        {
            title: 'Parámetros Globales',
            href: parameters.index(),
            icon: SlidersHorizontal,
        },
        {
            title: 'Configuración',
            href: configurations.index(),
            icon: Settings,
        },
        {
            title: 'Usuarios',
            href: users.index(),
            icon: Users,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <BimeticaBrandHeader />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={commercialNavItems} label="COMERCIAL & VENTAS" />
                {isAdmin && (
                    <NavMain items={adminNavItems} label="CONFIGURACIÓN & SISTEMA" />
                )}
            </SidebarContent>

            <SidebarFooter className="p-2 border-t border-sidebar-border/40">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
