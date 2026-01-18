export interface Ganaderia {
    ganaderia_id: string; // Matches Backend
    nombre: string;
    ubicacion?: string;
    propietario_user_id: string;
    created_at?: string;
}

export interface CreateGanaderiaDTO {
    nombre: string;
    ubicacion?: string;
}

export interface UpdateGanaderiaDTO extends Partial<CreateGanaderiaDTO> { }
