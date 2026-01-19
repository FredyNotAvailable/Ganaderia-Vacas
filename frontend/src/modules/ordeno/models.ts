export interface Ordeno {
    ordeno_id: string; // Matches Backend
    vaca_id: string;
    ganaderia_id: string;
    fecha_ordeno: string; // ISO Date or Timestamptz
    turno?: 'MANANA' | 'TARDE';
    litros: number;
    created_at?: string;
    // Optional join fields if needed for UI, though backend might not send them by default yet
    vaca?: {
        nombre: string;
        codigo: string;
    };
}

export interface CreateOrdenoDTO {
    vaca_id: string;
    ganaderia_id: string;
    fecha_ordeno: string;
    turno: 'MANANA' | 'TARDE';
    litros: number;
}

export interface UpdateOrdenoDTO extends Partial<CreateOrdenoDTO> { }
