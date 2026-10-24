import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, Check } from 'lucide-react';
import { useState } from 'react';
import { DeleteParameterDialog } from '@/components/parameters/delete-parameter-dialog';
import { ParameterDialog, type ParameterItem } from '@/components/parameters/parameter-dialog';
import { ParameterGroupCards } from '@/components/parameters/parameter-group-cards';
import { ParameterTable } from '@/components/parameters/parameter-table';
import parametersRoute from '@/routes/parameters';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Parámetros Globales',
        href: parametersRoute.index(),
    },
];

interface Props {
    parameters?: ParameterItem[];
}

export default function ParametersIndex({ parameters = [] }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [parameterToEdit, setParameterToEdit] = useState<ParameterItem | null>(null);
    const [parameterToDelete, setParameterToDelete] = useState<ParameterItem | null>(null);

    // Grupos dinámicos calculados directamente
    const groups = Array.from(
        new Map(parameters.map((p) => [p.group, p.group_label || p.group])).entries()
    ).map(([group, label]) => ({ group, label }));

    const activeGroup = groups.find((g) => g.group === selectedGroup);
    const groupParameters = selectedGroup ? parameters.filter((p) => p.group === selectedGroup) : [];

    const handleOpenCreate = () => {
        setParameterToEdit(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (item: ParameterItem) => {
        setParameterToEdit(item);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!parameterToDelete) return;

        router.delete(parametersRoute.destroy({ parameter: parameterToDelete.id }).url, {
            onSuccess: () => setParameterToDelete(null),
        });
    };

    return (
        <>
            <Head title={activeGroup ? activeGroup.label : 'Parámetros del Sistema'} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 transition-colors duration-200">
                {/* Alertas Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
                        <AlertCircle className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Vistas Desacopladas */}
                {!selectedGroup || !activeGroup ? (
                    <ParameterGroupCards
                        groups={groups}
                        parameters={parameters}
                        onSelectGroup={(groupKey) => setSelectedGroup(groupKey)}
                        onOpenCreate={handleOpenCreate}
                    />
                ) : (
                    <ParameterTable
                        group={activeGroup}
                        parameters={groupParameters}
                        onBack={() => setSelectedGroup(null)}
                        onOpenCreate={handleOpenCreate}
                        onOpenEdit={handleOpenEdit}
                        onOpenDelete={(item) => setParameterToDelete(item)}
                    />
                )}
            </div>

            {/* Modales */}
            <ParameterDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                parameterToEdit={parameterToEdit}
                existingGroups={groups}
                defaultGroup={selectedGroup ?? undefined}
            />

            <DeleteParameterDialog
                parameter={parameterToDelete}
                open={!!parameterToDelete}
                onOpenChange={(open) => !open && setParameterToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

ParametersIndex.layout = {
    breadcrumbs,
};
