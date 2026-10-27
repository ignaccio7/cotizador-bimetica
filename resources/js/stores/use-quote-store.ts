import { create } from 'zustand';
import type { ClientData } from '@/components/quotes/quote-client-card';
import type { DesignParameters } from '@/lib/quote-services';
import {
    createFloorName,
    getFloorDefaultDescription,
    insertFloorInOrder,
    type FloorGroupItem,
    type FloorItem,
} from '@/components/quotes/quote-floor-table';

export const INITIAL_CLIENT_DATA: ClientData = {
    fullName: '',
    phone: '',
    ci: '',
    address: '',
    occupation: '',
};

export const INITIAL_FLOOR_GROUPS: FloorGroupItem[] = [
    {
        id: 'group-1',
        table_name: 'Tabla 1',
        assigned_service_ids: [],
        floors: [
            {
                id: 'floor-1',
                name: 'PLANTA BAJA',
                description: 'Acceso peatonal, vehicular y ambientes sociales',
                area: '',
                isActive: true,
            },
        ],
    },
];

export interface QuoteState {
    // ── Estado ──
    clientData: ClientData;
    designParameters: DesignParameters;
    floorGroups: FloorGroupItem[];
    activeGroupId: string;
    selectedServiceIds: number[];
    serviceVariables: Record<number, Record<string, string>>;

    // ── Acciones de Cliente ──
    updateClientField: (field: keyof ClientData, value: string) => void;
    setClientData: (data: Partial<ClientData>) => void;

    // ── Acciones de Parámetros de Diseño ──
    updateDesignParameter: (key: string, value: string) => void;

    // ── Acciones de Tablas de Plantas ──
    setActiveGroupId: (id: string) => void;
    updateTableName: (groupId: string, newName: string) => void;
    addFloorGroup: () => void;
    deleteFloorGroup: (groupId: string) => void;

    // ── Acciones de Niveles / Pisos ──
    addFloorType: (groupId: string, type: 'planta' | 'subsuelo' | 'terraza') => void;
    toggleFloor: (groupId: string, floorId: string) => void;
    updateFloor: (
        groupId: string,
        floorId: string,
        field: keyof FloorItem,
        value: string | number | boolean
    ) => void;
    removeFloor: (groupId: string, floorId: string) => void;
    toggleServiceAssignment: (groupId: string, serviceId: number) => void;

    // ── Acciones de Servicios ──
    toggleService: (serviceId: number) => void;
    setSelectedServiceIds: (ids: number[]) => void;
    setServiceVariable: (serviceId: number, varName: string, value: string) => void;

    // ── Reset del Store al entrar/montar la página ──
    resetQuoteStore: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
    // Estado inicial
    clientData: { ...INITIAL_CLIENT_DATA },
    designParameters: {},
    floorGroups: JSON.parse(JSON.stringify(INITIAL_FLOOR_GROUPS)),
    activeGroupId: 'group-1',
    selectedServiceIds: [],
    serviceVariables: {},

    // Cliente
    updateClientField: (field, value) => {
        set((state) => ({
            clientData: { ...state.clientData, [field]: value },
        }));
    },
    setClientData: (data) => {
        set((state) => ({
            clientData: { ...state.clientData, ...data },
        }));
    },

    // Parámetros de Diseño
    updateDesignParameter: (key, value) => {
        set((state) => ({
            designParameters: { ...state.designParameters, [key]: value },
        }));
    },

    // Tablas de Plantas
    setActiveGroupId: (id) => {
        set({ activeGroupId: id });
    },
    updateTableName: (groupId, newName) => {
        set((state) => ({
            floorGroups: state.floorGroups.map((g) =>
                g.id === groupId ? { ...g, table_name: newName } : g
            ),
        }));
    },
    addFloorGroup: () => {
        set((state) => {
            let nextNumber = 1;
            while (
                state.floorGroups.some(
                    (g) => g.table_name.trim().toLowerCase() === `tabla ${nextNumber}`
                )
            ) {
                nextNumber++;
            }

            const newId = `group-${Date.now()}`;
            const newGroup: FloorGroupItem = {
                id: newId,
                table_name: `Tabla ${nextNumber}`,
                assigned_service_ids: [],
                floors: [
                    {
                        id: 'floor-1',
                        name: 'PLANTA BAJA',
                        description: 'Acceso peatonal, vehicular y ambientes sociales',
                        area: '',
                        isActive: true,
                    },
                ],
            };

            return {
                floorGroups: [...state.floorGroups, newGroup],
                activeGroupId: newId,
            };
        });
    },
    deleteFloorGroup: (groupId) => {
        set((state) => {
            const remaining = state.floorGroups.filter((g) => g.id !== groupId);
            const nextActiveId =
                groupId === state.activeGroupId && remaining.length > 0
                    ? remaining[0].id
                    : state.activeGroupId;

            return {
                floorGroups: remaining,
                activeGroupId: nextActiveId,
            };
        });
    },

    // Niveles / Pisos
    addFloorType: (groupId, type) => {
        set((state) => ({
            floorGroups: state.floorGroups.map((group) => {
                if (group.id !== groupId) return group;
                const name = createFloorName(type, group.floors);
                const description = getFloorDefaultDescription(type, name);
                const newFloor: FloorItem = {
                    id: `floor-${Date.now()}`,
                    name,
                    description,
                    area: '',
                    isActive: true,
                };
                return {
                    ...group,
                    floors: insertFloorInOrder(group.floors, newFloor, type),
                };
            }),
        }));
    },
    toggleFloor: (groupId, floorId) => {
        set((state) => ({
            floorGroups: state.floorGroups.map((g) =>
                g.id === groupId
                    ? {
                          ...g,
                          floors: g.floors.map((f) =>
                              f.id === floorId ? { ...f, isActive: !f.isActive } : f
                          ),
                      }
                    : g
            ),
        }));
    },
    updateFloor: (groupId, floorId, field, value) => {
        set((state) => ({
            floorGroups: state.floorGroups.map((g) =>
                g.id === groupId
                    ? {
                          ...g,
                          floors: g.floors.map((f) =>
                              f.id === floorId ? { ...f, [field]: value } : f
                          ),
                      }
                    : g
            ),
        }));
    },
    removeFloor: (groupId, floorId) => {
        set((state) => ({
            floorGroups: state.floorGroups.map((g) =>
                g.id === groupId
                    ? {
                          ...g,
                          floors: g.floors.filter((f) => f.id !== floorId),
                      }
                    : g
            ),
        }));
    },
    toggleServiceAssignment: (groupId, serviceId) => {
        set((state) => ({
            floorGroups: state.floorGroups.map((g) =>
                g.id === groupId
                    ? {
                          ...g,
                          assigned_service_ids: g.assigned_service_ids.includes(serviceId)
                              ? g.assigned_service_ids.filter((id) => id !== serviceId)
                              : [...g.assigned_service_ids, serviceId],
                      }
                    : g
            ),
        }));
    },

    // Servicios
    toggleService: (serviceId) => {
        set((state) => ({
            selectedServiceIds: state.selectedServiceIds.includes(serviceId)
                ? state.selectedServiceIds.filter((id) => id !== serviceId)
                : [...state.selectedServiceIds, serviceId],
        }));
    },
    setSelectedServiceIds: (ids) => {
        set({ selectedServiceIds: ids });
    },
    setServiceVariable: (serviceId, varName, value) => {
        set((state) => ({
            serviceVariables: {
                ...state.serviceVariables,
                [serviceId]: {
                    ...(state.serviceVariables[serviceId] || {}),
                    [varName]: value,
                },
            },
        }));
    },

    // Reset completo
    resetQuoteStore: () => {
        set({
            clientData: { ...INITIAL_CLIENT_DATA },
            designParameters: {},
            floorGroups: JSON.parse(JSON.stringify(INITIAL_FLOOR_GROUPS)),
            activeGroupId: 'group-1',
            selectedServiceIds: [],
            serviceVariables: {},
        });
    },
}));
