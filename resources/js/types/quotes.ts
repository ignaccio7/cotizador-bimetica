import type { ServiceItem, VariableItem } from './services';

export interface ClientItem {
    id: number;
    code: string;
    full_name: string;
    ci: string;
    phone: string;
    address: string;
    occupation: string;
}

export interface CityItem {
    id: number;
    name: string;
    viatico: number;
}

export interface FloorItem {
    id: string;
    name: string;
    description: string;
    area: number;
    isActive: boolean;
}

export interface FloorGroupItem {
    id: string;
    table_name: string;
    floors: FloorItem[];
    total_area: number;
    assigned_service_ids: number[];
}

export interface QuoteServiceItem {
    service_id: number;
    quote_floor_group_id: string | null;
    filled_variables: Record<string, any>;
    subtotal: number;
}

export interface QuoteCreateProps {
    clients?: ClientItem[];
    servicesCatalog?: ServiceItem[];
    availableVariables?: VariableItem[];
    cities?: CityItem[];
    nextQuoteCode?: string;
}
