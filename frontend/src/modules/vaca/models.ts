export interface Vaca {
    vaca_id: string; // Matches Backend
    ganaderia_id: string;
    codigo: string;
    nombre?: string;
    raza?: string;
    fecha_nacimiento?: string; // ISO Date string
    estado?: string; // 'ACTIVA', etc
    tipo: 'VACA' | 'NOVILLA' | 'TERNERA';
    imagen_url?: string;
    created_at?: string;
}

export interface CreateVacaDTO {
    codigo: string;
    nombre?: string;
    raza?: string;
    fecha_nacimiento?: string;
    estado?: string;
    tipo: 'VACA' | 'NOVILLA' | 'TERNERA';
    ganaderia_id: string; // Required for creation
}

export interface UpdateVacaDTO extends Partial<CreateVacaDTO> { }
