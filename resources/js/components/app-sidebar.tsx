import { Calculator, FilePlus, LayoutGrid, Sliders } from 'lucide-react';
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
import quotes from '@/routes/quotes';
import services from '@/routes/services';
import variables from '@/routes/variables';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Nueva Cotización',
        href: quotes.create(),
        icon: FilePlus,
    },
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
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <BimeticaBrandHeader />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="p-2 border-t border-sidebar-border/40">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
