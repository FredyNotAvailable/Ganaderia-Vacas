export interface Ganaderia {
    ganaderia_id: string; // Matches Backend
    nombre: string;
    ubicacion?: string;
    propietario_user_id: string;
    rol?: 'DUEÑO' | 'COMPARTIDA';
    permiso?: string;
    rol_detalle?: {
        id: string;
        nombre: string;
        codigo: string;
    };
    created_at?: string;
}

export interface CreateGanaderiaDTO {
    nombre: string;
    ubicacion?: string;
}

export interface UpdateGanaderiaDTO extends Partial<CreateGanaderiaDTO> { }
