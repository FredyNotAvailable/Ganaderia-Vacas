export interface Vaca {
    vaca_id: string;
    ganaderia_id: string;
    codigo: string;
    nombre?: string;
    raza?: string;
    fecha_nacimiento?: string;
    estado?: string;
    tipo: 'VACA' | 'NOVILLA' | 'TERNERA';
    created_at?: string;
}

export interface IVacaRepository {
    create(vaca: Partial<Vaca>): Promise<Vaca>;
    listByGanaderia(ganaderiaId: string): Promise<Vaca[]>;
    update(id: string, vaca: Partial<Vaca>): Promise<Vaca>;
    delete(id: string): Promise<void>;
}
